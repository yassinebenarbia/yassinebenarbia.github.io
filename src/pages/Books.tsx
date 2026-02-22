// TODO: add personal rating
import { useEffect, useState } from 'react';
import { BookStatus, UserConfig as Config } from "@/interfaces/user-config";
import { getSanitizedConfig } from '@/utils';
import { BG_COLOR } from '@/constants';
import ThemeChanger from '@/components/theme-changer';
import BookCard from '@/components/book-card';

/// Fetches books using ISBN number derived from config and appends config rating
const CACHE_PREFIX = "book_";
const CACHE_VERSION = "v1";
const CACHE_TTL = 1000 * 60 * 60 * 24 * 30; // 30 days

type CachedBook = {
  version: string;
  timestamp: number;
  data: any;
};

interface Book {
  title: string;
  authors: string;
  status: BookStatus;
  link?: string;
  imageUrl?: string;
  rating?: number;
}

class Book implements Book {
  title: string;
  authors: string;
  status: BookStatus;
  link?: string;
  imageUrl?: string;
  rating?: number;

  constructor(
    title: string,
    authors: string,
    status: BookStatus,
    link?: string,
    imageUrl?: string,
    rating?: number,
  ) {
    this.title = title;
    this.authors = authors;
    this.status = status;
    this.link = link;
    this.rating = rating;
    this.imageUrl = imageUrl;
  }
}

interface BookISBN {
  ISBN: string;
  status: BookStatus;
  rating?: number;
}

interface BookCover {
  small?: string;
  medium?: string;
  large?: string;
}

async function imageCover(
  cover: BookCover | undefined,
  isbn: string | undefined
): Promise<string> {
  const placeholder =
    "https://openlibrary.org/images/icons/avatar_book-lg.png";

  let imageUrl = cover?.large ?? cover?.medium ?? cover?.small;

  if (!imageUrl && isbn) {
    imageUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  }

  if (!imageUrl) return placeholder;

  try {
    const cache = await caches.open("covers-v1");
    const cached = await cache.match(imageUrl);

    if (cached) {
      return imageUrl;
    }

    const response = await fetch(imageUrl, { cache: "force-cache" });

    if (!response.ok) return placeholder;

    const clone = response.clone();
    await cache.put(imageUrl, clone);

    const blob = await response.blob();

    if (blob.size < 200) return placeholder;

    return imageUrl;
  } catch (err) {
    console.error("Cache error:", err);
    return imageUrl;
  }
}

// Cast config to a type that includes the books array for easier access.
function renderBooks(categorizedBooks: Record<string, Book[]>): import("react").ReactNode {
  return (
    <div className="container mx-auto p-4">
      {Object.keys(categorizedBooks).map((status) => (
        <section key={status} className="mb-4">
          <h2 className="text-3xl font-semibold capitalize mb-4">{status.replace('-', ' ')}</h2>
          {categorizedBooks[status].length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categorizedBooks[status].map((book) => (
                <BookCard key={book.title} book={book} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No books in this category yet.</p>
          )}
        </section>
      ))}
    </div>
  )
}

/**
 * Factory function to transform API response and local config into Book objects
 */
async function createBookInstances(
  configs: BookISBN[],
  apiData: Record<string, any>
): Promise<Book[]> {
  const bookPromises = configs.map(async (config) => {
    const rawData = apiData[`ISBN:${config.ISBN}`];
    console.log("isbn", config.ISBN, "raw", rawData)

    const authorNames = rawData?.authors
      ? rawData.authors.map((a: any) => a.name).join(', ')
      : 'Unknown Author';

    const displayImage = await imageCover(rawData?.cover, rawData?.identifiers.isbn_10 || rawData?.identifiers.isbn_10);

    return new Book(
      rawData?.title || "Unkwown",
      authorNames,
      config.status as BookStatus,
      rawData?.url,
      displayImage,
      config.rating,
    );
  });

  return Promise.all(bookPromises);
}

async function fetchMyLibrary(configs: BookISBN[]): Promise<Book[]> {
  const cachedData: Record<string, any> = {};
  const missingCache: BookISBN[] = [];

  for (const cfg of configs) {
    const key = `${CACHE_PREFIX}${cfg.ISBN}`;
    const raw = localStorage.getItem(key);

    if (raw) {
      try {
        const parsed: CachedBook = JSON.parse(raw);

        const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;
        const isWrongVersion = parsed.version !== CACHE_VERSION;

        if (!isExpired && !isWrongVersion) {
          cachedData[`ISBN:${cfg.ISBN}`] = parsed.data;
          continue;
        }
      } catch {
        console.warn("Corrupt cache removed:", key);
        localStorage.removeItem(key);
      }
    }

    missingCache.push(cfg);
  }

  let fullApiData = { ...cachedData };

  if (missingCache.length > 0) {
    const bibkeys = missingCache.map(c => `ISBN:${c.ISBN}`).join(",");
    const url = `https://openlibrary.org/api/books?bibkeys=${bibkeys}&jscmd=data&format=json`;

    try {
      const response = await fetch(url);
      const freshData = await response.json();

      Object.entries(freshData).forEach(([key, val]) => {
        const isbn = key.replace("ISBN:", "");
        const cacheEntry: CachedBook = {
          version: CACHE_VERSION,
          timestamp: Date.now(),
          data: val,
        };

        try {
          localStorage.setItem(
            `${CACHE_PREFIX}${isbn}`,
            JSON.stringify(cacheEntry)
          );
        } catch (err) {
          console.warn("localStorage quota exceeded, skipping cache");
        }
      });

      fullApiData = { ...fullApiData, ...freshData };
    } catch (e) {
      console.error("Failed to fetch new data", e);
    }
  }

  return createBookInstances(configs, fullApiData);
}

const ReadingList = ({ config }: { config: Config }) => {
  const [categorizedBooks, setCategorizedBooks] = useState<Record<string, Book[]>>({
    read: [],
    reading: [],
    'to-read': [],
    'wont-read': [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const typedConfig = config as { books?: BookISBN[] };
        const configList = typedConfig.books || [];

        const books = await fetchMyLibrary(configList);

        const newCategories: Record<string, Book[]> = {
          read: [],
          reading: [],
          'to-read': [],
          'wont-read': [],
        };

        books.forEach((book) => {
          newCategories[book.status].push(book);
        });

        setCategorizedBooks(newCategories);
        setLoading(false);

      } catch (error) {
        console.error(`Error fetching Books:`, error);
        return null;
      }
    };

    loadBooks();
  }, []);

  if (loading) return <div>Loading library...</div>;

  const header = "Reading List";
  const sanitizedConfig = getSanitizedConfig(config);

  return (
    <div className={`p-4 lg:p-10 min-h-full ${BG_COLOR}`} >
      <div className="flex justify-between items-center">
        <a href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </a>
        <ThemeChanger
          loading={false}
          themeConfig={sanitizedConfig.themeConfig}
        />
      </div>
      <div className="text-center mt-4">
        <h1 className="text-5xl lg:text-7xl font-bold mb-10">{header}</h1>
      </div>
      {renderBooks(categorizedBooks)}
    </div>
  );
};

export { ReadingList, Book };
