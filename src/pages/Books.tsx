// TODO: add personal rating
import { useEffect, useState } from 'react';
import { BookStatus, UserConfig as Config } from "@/interfaces/user-config";
import { getSanitizedConfig } from '@/utils';
import { BG_COLOR } from '@/constants';
import ThemeChanger from '@/components/theme-changer';

interface Book {
  title: string;
  authors: string;
  status: BookStatus;
  link?: string;
  imageUrl?: string;
}

class Book implements Book {
  title: string;
  authors: string;
  status: BookStatus;
  link?: string;
  imageUrl?: string;

  constructor(
    title: string,
    authors: string,
    status: BookStatus,
    link?: string,
    imageUrl?: string,
  ) {
    this.title = title;
    this.authors = authors;
    this.status = status;
    this.link = link;
    this.imageUrl = imageUrl;
  }
}

interface BookISBN {
  ISBN: string;
  status: BookStatus;
}

interface BookCover {
  small?: string;
  medium?: string;
  large?: string;
}

async function imageCover(cover: BookCover | undefined, isbn: string | undefined): Promise<string> {
  const placeholder = 'https://openlibrary.org/images/icons/avatar_book-lg.png';

  let imageUrl = cover?.large ?? cover?.medium ?? cover?.small;

  if (!imageUrl && isbn) {
    imageUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  }

  if (!imageUrl) {
    return placeholder;
  }

  try {
    const cache = await caches.open('covers-v1');
    let cachedResponse = await cache.match(imageUrl);

    if (!cachedResponse) {
      console.log(`Caching image: ${imageUrl}`);
      const response = await fetch(imageUrl);

      if (!response.ok) {
        return placeholder;
      }

      await cache.put(imageUrl, response.clone());
      cachedResponse = response;
    }

    const blob = await cachedResponse.blob();

    if (blob.size < 100) return placeholder;

    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Cache API error, falling back to direct URL:", error);
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
                <div key={book.title} className="bg-base-100 shadow-xl rounded-lg p-6 flex flex-col">
                  <h3 className="text-2xl font-bold mb-2">{book.title}</h3>
                  <p className="text-lg text-gray-500 mb-4">by {book.authors}</p>
                  {book.imageUrl && (
                    <img
                      src={book.imageUrl}
                      alt={`Cover of ${book.title}`}
                      className="w-32 h-48 object-cover mx-auto mb-4 rounded-md shadow-md"
                      loading="lazy"
                    />
                  )}
                  <div className="mt-auto">
                    {book.link && (
                      <a
                        href={book.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm mr-2"
                      >
                        Details
                      </a>
                    )}
                  </div>
                </div>
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
  console.log("asdf", apiData)
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
      displayImage
    );
  });

  return Promise.all(bookPromises);
}

async function fetchMyLibrary(configs: BookISBN[]): Promise<Book[]> {
  const cachedData: Record<string, any> = {};
  const missingCache: BookISBN[] = [];

  configs.forEach(cfg => {
    const saved = localStorage.getItem(`book_${cfg.ISBN}`);
    if (saved) {
      cachedData[`ISBN:${cfg.ISBN}`] = JSON.parse(saved);
    } else {
      missingCache.push(cfg);
    }
  });

  let fullApiData = { ...cachedData };

  if (missingCache.length > 0) {
    const bibkeys = missingCache.map(c => `ISBN:${c.ISBN}`).join(',');
    const url = `https://openlibrary.org/api/books?bibkeys=${bibkeys}&jscmd=data&format=json`;

    try {
      const response = await fetch(url);
      const freshData = await response.json();

      // Save to localStorage
      Object.entries(freshData).forEach(([key, val]) => {
        localStorage.setItem(`book_${key.replace("ISBN:", "")}`, JSON.stringify(val));
      });

      fullApiData = { ...fullApiData, ...freshData };
    } catch (e) {
      console.error("Failed to fetch new data", e);
    }
  }

  return await createBookInstances(configs, fullApiData);
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

export default ReadingList;
