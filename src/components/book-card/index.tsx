import { Book } from "@/pages/Books";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";

const STATUS_BADGE = {
  read: {
    label: "Read",
    classes: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
  },
  reading: {
    label: "Reading",
    classes: "border-amber-500/30 bg-amber-500/10 text-amber-600",
  },
  "to-read": {
    label: "To Read",
    classes: "border-sky-500/30 bg-sky-500/10 text-sky-600",
  },
  "wont-read": {
    label: "Won't Read",
    classes: "border-rose-500/30 bg-rose-500/10 text-rose-600",
  },
} as const;

export default function BookCard({ book }: { book: Book }) {
  const badge = STATUS_BADGE[book.status];

  return (
    <article className="flex h-full flex-col rounded-[1.75rem] border border-base-300/70 bg-base-100 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${badge.classes}`}>
          {badge.label}
        </span>
        {book.rating != null && (
          <Tooltip title={`${book.rating} / 5`} arrow>
            <div className="shrink-0">
              <Rating
                value={book.rating}
                precision={0.5}
                readOnly
                size="small"
              />
            </div>
          </Tooltip>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center text-center">
        {book.imageUrl ? (
          book.link ? (
            <a
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
              aria-label={`Open details for ${book.title}`}
            >
              <img
                src={book.imageUrl}
                alt={`Cover of ${book.title}`}
                className="h-44 w-32 rounded-2xl object-cover shadow-md transition hover:opacity-90"
                loading="lazy"
              />
            </a>
          ) : (
            <img
              src={book.imageUrl}
              alt={`Cover of ${book.title}`}
              className="h-44 w-32 shrink-0 rounded-2xl object-cover shadow-md"
              loading="lazy"
            />
          )
        ) : (
          <div className="flex h-44 w-32 shrink-0 items-center justify-center rounded-2xl bg-base-200 text-center text-xs text-base-content/45">
            No Cover
          </div>
        )}

        <div className="mt-4 min-w-0 flex-1">
          <h3 className="text-lg font-semibold leading-tight text-base-content">
            {book.title}
          </h3>

          <Tooltip title={book.authors} arrow>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-base-content/70">
              by {book.authors}
            </p>
          </Tooltip>

          <div className="mt-5 pt-2">
            {book.link ? (
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-base-300 px-3 py-1.5 text-sm font-medium text-base-content/80 transition hover:border-base-content/25 hover:text-base-content"
              >
                View book
              </a>
            ) : (
              <span className="text-sm text-base-content/45">
                No external link
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
