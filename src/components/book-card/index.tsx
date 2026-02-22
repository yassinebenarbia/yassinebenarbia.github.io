import { Book } from "@/pages/Books";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";

export default function BookCard({ book }: { book: Book }) {
  return (
    <article className="bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg p-6 flex flex-col h-full">

      <h3 className="text-xl font-bold leading-tight mb-1 text-center">
        {book.title}
      </h3>

      <Tooltip title={book.authors} arrow>
        <p className="text-sm mb-4 line-clamp-2 text-center">
          by {book.authors}
        </p>
      </Tooltip>

      {book.imageUrl ? (
        book.link ? (
          <a
            href={book.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mb-4"
          >
            <img
              src={book.imageUrl}
              alt={`Cover of ${book.title}`}
              className="w-32 h-48 object-cover rounded-md shadow-md hover:opacity-90 transition"
              loading="lazy"
            />
          </a>
        ) : (
          <img
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            className="w-32 h-48 object-cover mx-auto mb-4 rounded-md shadow-md"
            loading="lazy"
          />
        )
      ) : (
        <div className="w-32 h-48 mx-auto mb-4 rounded-md bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
          No Cover
        </div>
      )}

      {book.rating != null && (
        <div className="mt-auto pt-2 flex justify-center">
          <Tooltip title={`${book.rating} / 5`} arrow>
            <div>
              <Rating
                value={book.rating}
                precision={0.5}
                readOnly
                size="large"
              />
            </div>
          </Tooltip>
        </div>
      )}
    </article>
  );
}
