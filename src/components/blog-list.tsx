import { format } from "date-fns";
import { UserConfig as Config, BlogArticle } from "@/interfaces/user-config";
import ThemeChanger from "./theme-changer";
import { getSanitizedConfig } from "../utils";
import { BG_COLOR } from "@/constants";

const renderBlogs = (blogs: Record<string, BlogArticle>) => {
  return Object.entries(blogs).map(([key, value]) => {
    const blog_href = `/blogs/${key}`;
    return (
      <a
        key={key}
        className="card shadow-lg compact bg-base-100 cursor-pointer w-full transition-transform duration-300 transform hover:scale-105"
        href={blog_href}
      >
        <div className="flex justify-between flex-col p-8 h-full w-full">
          <div>
            <h2 className="card-title text-2xl font-bold text-base-content">
              {value.title}
            </h2>
            <p className="mb-2 mt-2 text-base-content text-opacity-70">
              {value.desc || ""}
            </p>
            <>
              {value.tags && value.tags.length != 0 && (
                <div className="mb-1">
                  {value.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="badge mr-2 rounded-md bg-base-300 "
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          </div>
          <div className="flex justify-between text-sm text-base-content text-opacity-60">
            <div className="flex items-center">
              {value.ttr && (
                <span className="mr-3">
                  {Math.ceil(value.ttr / 60)} min read
                </span>
              )}
              {value.date && (
                <span>{format(new Date(value.date), "MMMM dd, yyyy")}</span>
              )}
            </div>
          </div>
        </div>
      </a>
    );
  });
};

/**
 * Renders the GitProfile component.
 *
 * @param {Object} config - the configuration object
 * @return {JSX.Element} the rendered GitProfile component
 */
const BlogList = ({ config }: { config: Config }) => {
  if (!config.blogs) {
    return <div>No blogs configured.</div>;
  }

  const header = "Blogs";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderBlogs(config.blogs)}
      </div>
    </div>
  );
};

export default BlogList;
