import { useEffect, useMemo, useState } from 'react';
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

type CategorizedBooks = Record<BookStatus, Book[]>;
type ExpandedSections = Record<BookStatus, boolean>;

const BOOK_STATUSES: BookStatus[] = ["reading", "to-read", "read", "wont-read"];
const PREVIEW_BOOK_COUNT = 3;

const STATUS_META: Record<
  BookStatus,
  {
    label: string;
    eyebrow: string;
    description: string;
    accent: string;
    surface: string;
    border: string;
    empty: string;
  }
> = {
  reading: {
    label: "Reading",
    eyebrow: "In progress",
    description: "Books currently open and actively being worked through.",
    accent: "text-amber-500",
    surface: "from-amber-500/20 via-transparent to-transparent",
    border: "border-amber-500/30",
    empty: "Nothing is being read right now.",
  },
  "to-read": {
    label: "To Read",
    eyebrow: "Up next",
    description: "Titles queued up for future reading.",
    accent: "text-sky-500",
    surface: "from-sky-500/20 via-transparent to-transparent",
    border: "border-sky-500/30",
    empty: "No books are queued here yet.",
  },
  read: {
    label: "Have Read",
    eyebrow: "Finished",
    description: "Completed books with ratings where available.",
    accent: "text-emerald-500",
    surface: "from-emerald-500/20 via-transparent to-transparent",
    border: "border-emerald-500/30",
    empty: "No finished books have been added yet.",
  },
  "wont-read": {
    label: "Won't Read",
    eyebrow: "Passed on",
    description: "Books intentionally skipped or dropped.",
    accent: "text-rose-500",
    surface: "from-rose-500/20 via-transparent to-transparent",
    border: "border-rose-500/30",
    empty: "Nothing has been marked as skipped.",
  },
};

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

function renderBooks(
  categorizedBooks: CategorizedBooks,
  expandedSections: ExpandedSections,
  onSelectSection: (status: BookStatus) => void,
  onToggleSection: (status: BookStatus) => void
): import("react").ReactNode {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <nav className="reading-list-nav">
        <div className="grid gap-3 md:grid-cols-4">
          {BOOK_STATUSES.map((status) => {
            const meta = STATUS_META[status];
            const books = categorizedBooks[status];
            const isExpanded = expandedSections[status];

            return (
              <button
                key={status}
                type="button"
                onClick={() => onSelectSection(status)}
                className={`rounded-3xl border bg-base-100/85 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${meta.border}`}
              >
                <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${meta.accent}`}>
                  {meta.eyebrow}
                </p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{meta.label}</h2>
                    <p className="text-sm text-base-content/65">{meta.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-3xl font-bold leading-none">{books.length}</span>
                    <span className="mt-2 block text-xs uppercase tracking-[0.2em] text-base-content/45">
                      {isExpanded ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {BOOK_STATUSES.map((status) => {
        const books = categorizedBooks[status];
        const meta = STATUS_META[status];
        const isExpanded = expandedSections[status];
        const visibleBooks = isExpanded ? books : books.slice(0, PREVIEW_BOOK_COUNT);
        const hiddenCount = books.length - visibleBooks.length;

        return (
          <section
            key={status}
            id={status}
            data-reading-section={status}
            className="scroll-mt-28"
          >
            <div
            className={`overflow-hidden rounded-[2rem] border bg-gradient-to-br ${meta.surface} bg-base-100/90 p-5 shadow-sm md:p-7 ${meta.border}`}
            >
              <button
                type="button"
                onClick={() => onToggleSection(status)}
                aria-expanded={isExpanded}
                className="flex w-full flex-col gap-4 text-left md:flex-row md:items-end md:justify-between"
              >
                <div className="max-w-2xl">
                  <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${meta.accent}`}>
                    {meta.eyebrow}
                  </p>
                  <h3 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                    {meta.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-base-content/70 md:text-base">
                    {meta.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto">
                  <div className="rounded-2xl border border-base-300/80 bg-base-100/80 px-4 py-3 text-sm text-base-content/70">
                    {books.length} {books.length === 1 ? "book" : "books"}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-base-300/80 bg-base-100/80 text-base-content/70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </button>

              <div className="mt-6 border-t border-base-300/70 pt-6">
                {books.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {visibleBooks.map((book) => (
                        <BookCard key={`${status}-${book.title}`} book={book} />
                      ))}
                    </div>

                    {books.length > 1 && (
                      <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-base-300/80 bg-base-100/60 px-4 py-3">
                        <p className="text-sm text-base-content/60">
                          {isExpanded
                            ? "Showing the full list."
                            : `${hiddenCount} more ${hiddenCount === 1 ? "book" : "books"} hidden in preview.`}
                        </p>
                        <button
                          type="button"
                          onClick={() => onToggleSection(status)}
                          className="inline-flex items-center rounded-full border border-base-300 px-4 py-2 text-sm font-medium text-base-content/80 transition hover:border-base-content/25 hover:text-base-content"
                        >
                          {isExpanded ? "Show less" : "Expand list"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center italic text-base-content/55">
                    {meta.empty}
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function BooksOverview({ categorizedBooks }: { categorizedBooks: CategorizedBooks }) {
  const totals = useMemo(() => {
    const total = BOOK_STATUSES.reduce(
      (sum, status) => sum + categorizedBooks[status].length,
      0
    );

    return {
      total,
      reading: categorizedBooks.reading.length,
      completed: categorizedBooks.read.length,
    };
  }, [categorizedBooks]);

  return (
    <section className="mx-auto mt-8 max-w-7xl px-4">
      <div className="overflow-hidden rounded-[2rem] border border-base-300/70 bg-base-100/85 shadow-sm">
        <div className="grid gap-8 p-6 md:grid-cols-[1.6fr_1fr] md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-base-content/55">
              Personal library
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              Reading List
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-base-content/70 md:text-base">
              List of books I hope you like &lt;3
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
            <div className="rounded-2xl border border-base-300/80 bg-base-200/60 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-base-content/50">Total</p>
              <p className="mt-2 text-3xl font-semibold">{totals.total}</p>
            </div>
            <div className="rounded-2xl border border-base-300/80 bg-base-200/60 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-base-content/50">Reading now</p>
              <p className="mt-2 text-3xl font-semibold">{totals.reading}</p>
            </div>
            <div className="rounded-2xl border border-base-300/80 bg-base-200/60 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-base-content/50">Completed</p>
              <p className="mt-2 text-3xl font-semibold">{totals.completed}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto mt-8 max-w-7xl px-4">
      <div className="rounded-[2rem] border border-base-300/70 bg-base-100/80 p-10 text-center text-base-content/60 shadow-sm">
        Loading library...
      </div>
    </div>
  );
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
  const [categorizedBooks, setCategorizedBooks] = useState<CategorizedBooks>({
    read: [],
    reading: [],
    'to-read': [],
    'wont-read': [],
  });
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    read: false,
    reading: false,
    'to-read': false,
    'wont-read': false,
  });
  const [loading, setLoading] = useState(true);

  const focusSection = (status: BookStatus) => {
    window.history.replaceState(null, "", `#${status}`);

    requestAnimationFrame(() => {
      const section = document.querySelector<HTMLElement>(
        `[data-reading-section="${status}"]`
      );

      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const toggleSection = (status: BookStatus) => {
    setExpandedSections((current) => {
      const next = {
        read: false,
        reading: false,
        "to-read": false,
        "wont-read": false,
      };

      next[status] = !current[status];
      return next;
    });
  };

  const selectSection = (status: BookStatus) => {
    focusSection(status);
  };

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const typedConfig = config as { books?: BookISBN[] };
        const configList = typedConfig.books || [];

        const books = await fetchMyLibrary(configList);

        const newCategories: CategorizedBooks = {
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

  useEffect(() => {
    const activeStatus = BOOK_STATUSES.find((status) => expandedSections[status]);

    if (activeStatus) {
      focusSection(activeStatus);
    }
  }, [expandedSections]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as BookStatus;

    if (BOOK_STATUSES.includes(hash)) {
      focusSection(hash);
    }
  }, []);

  if (loading) {
    return (
      <div className={`p-4 lg:p-10 min-h-full ${BG_COLOR}`}>
        <LoadingState />
      </div>
    );
  }

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
      <BooksOverview categorizedBooks={categorizedBooks} />
      {renderBooks(categorizedBooks, expandedSections, selectSection, toggleSection)}
    </div>
  );
};

export { ReadingList, Book };
