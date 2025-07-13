import { AiOutlineContainer } from "react-icons/ai";
import { format } from "date-fns";
import {
  SanitizedBlogConfig,
  SanitizedBlogArticle,
} from "@/interfaces/sanitized-config";
import Tag from "@/interfaces/tags";
import { ga, skeleton } from "@/utils";

const BlogCard = ({
  loading,
  blog,
  articles,
  googleAnalyticsId,
}: {
  loading: boolean;
  blog: SanitizedBlogConfig;
  articles: { [key: string]: SanitizedBlogArticle };
  googleAnalyticsId?: string;
}) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < blog.limit; index++) {
      array.push(
        <div className="card shadow-lg compact bg-base-100" key={index}>
          <div className="p-8 h-full w-full">
            <div className="flex items-center flex-col md:flex-row">
              <div className="avatar mb-5 md:mb-0">
                <div className="w-24 h-24 mask mask-squircle">
                  {skeleton({
                    widthCls: "w-full",
                    heightCls: "h-full",
                    shape: "",
                  })}
                </div>
              </div>
              <div className="w-full">
                <div className="flex items-start px-4">
                  <div className="w-full">
                    <h2>
                      {skeleton({
                        widthCls: "w-full",
                        heightCls: "h-8",
                        className: "mb-2 mx-auto md:mx-0",
                      })}
                    </h2>
                    {skeleton({
                      widthCls: "w-24",
                      heightCls: "h-3",
                      className: "mx-auto md:mx-0",
                    })}
                    <div className="mt-3">
                      {skeleton({
                        widthCls: "w-full",
                        heightCls: "h-4",
                        className: "mx-auto md:mx-0",
                      })}
                    </div>
                    <div className="mt-4 flex items-center flex-wrap justify-center md:justify-start">
                      {skeleton({
                        widthCls: "w-32",
                        heightCls: "h-4",
                        className: "md:mr-2 mx-auto md:mx-0",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
      );
    }

    return array;
  };

  const renderArticles = () => {
    const articleEntries: [string, SanitizedBlogArticle][] =
      Object.entries(articles);

    return articleEntries && articleEntries.length ? (
      articleEntries.slice(0, blog.limit).map(([key, article], index) => (
        <a
          className="card shadow-lg compact bg-base-100 cursor-pointer"
          key={index}
          href={`/blogs/${key}`}
          onClick={(e) => {
            e.preventDefault();

            try {
              if (googleAnalyticsId) {
                ga.event("Click Blog Post", {
                  post: String(article.title),
                });
              }
            } catch (error) {
              console.error(error);
            }

            window.location.href = `/blogs/${key}`;
          }}
        >
          <div className="p-8 h-full w-full">
            <div className="flex items-center flex-col md:flex-row">
              <div className="w-full">
                <div className="flex items-start px-4">
                  <div className="text-center md:text-left w-full">
                    <h2 className="font-bold cart-title text-lg text-base-content opacity-60">
                      {article.title}
                    </h2>
                    {article.date && (
                      <p className="text-base-content opacity-50 text-xs">
                        {format(new Date(article.date), "MMMM dd, yyyy")}
                      </p>
                    )}
                    <p className="mt-3 text-base-content text-opacity-60 text-sm">
                      {article.desc}
                    </p>
                    <div className="mt-4 flex items-center flex-wrap justify-center md:justify-start">
                      {article.tags &&
                        article.tags.map((category: Tag, index2: number) => (
                          <div
                            className="py-2 px-4 text-xs leading-3 rounded-full bg-base-300 mr-1 mb-1 opacity-50 text-base-content"
                            key={index2}
                          >
                            #{category}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      ))
    ) : (
      <div className="text-center mb-6">
        <AiOutlineContainer className="mx-auto h-12 w-12 opacity-30" />
        <p className="mt-1 text-sm opacity-50 text-base-content">
          No recent post
        </p>
      </div>
    );
  };

  return (
    <div className="col-span-1 lg:col-span-2">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <div
            className={`card compact bg-base-200 border border-base-300 ${
              loading || (articles && Object.keys(articles).length)
                ? "shadow-md bg-opacity-40"
                : "shadow-xl"
            }`}
          >
            <div className="card-body">
              <div className="mx-3 mb-2">
                <h5 className="card-title">
                  {loading ? (
                    skeleton({ widthCls: "w-28", heightCls: "h-8" })
                  ) : (
                    <span className="text-base-content opacity-70">
                      My Blogs
                    </span>
                  )}
                </h5>
              </div>
              <div className="col-span-2">
                <div className="grid grid-cols-1 gap-6">
                  {loading || !articles ? renderSkeleton() : renderArticles()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
