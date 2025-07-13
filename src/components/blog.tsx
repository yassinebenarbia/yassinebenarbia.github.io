import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { UserConfig as Config } from "@/interfaces/user-config";
import { SanitizedBlogArticle as BlogArticle } from "@/interfaces/sanitized-config";
import Tag from "@/interfaces/tags";
import ThemeChanger from "./theme-changer";
import { getSanitizedConfig } from "../utils";

const components = {
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h1 className="text-4xl font-bold mb-4" {...props} />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-3xl font-bold mb-4" {...props} />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h3 className="text-2xl font-bold mb-4" {...props} />
  ),
  h4: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h4 className="text-xl font-bold mb-4" {...props} />
  ),
  h5: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h5 className="text-lg font-bold mb-4" {...props} />
  ),
  h6: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h6 className="text-base font-bold mb-4" {...props} />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="mb-4" {...props} />
  ),
  a: (props: React.HTMLProps<HTMLAnchorElement>) => (
    <a className="text-primary underline" {...props} />
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-4" {...props} />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-4" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="mb-2" {...props} />
  ),
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-primary pl-4 italic my-4"
      {...props}
    />
  ),
};

/**
 * Renders the GitProfile component.
 *
 * @param {Object} config - the configuration object
 * @return {JSX.Element} the rendered GitProfile component
 */
const Blog = ({ config }: { config: Config }) => {
  if (!config.blogs) {
    return <div>No blogs configured.</div>;
  }

  let { BlogName: BlogIdentifier } = useParams();

  if (!BlogIdentifier) {
    return <div>Blog identifier is missing.</div>;
  }

  const blog_obj = config.blogs?.[BlogIdentifier];
  const sanitizedConfig = getSanitizedConfig(config);

  if (!blog_obj) {
    return <div>Blog does not exist</div>;
  } else {
    const [Content, setContent] = useState<React.ComponentType | null>(null);
    useEffect(() => {
      async function loadMDX() {
        try {
          const modules = import.meta.glob("/blogs/*.mdx");
          const mdxModule = await modules[`/blogs/${blog_obj.path}.mdx`]();
          setContent(() => (mdxModule as any).default);
        } catch (error) {
          console.error("MDX import failed", error);
        }
      }

      loadMDX();
    }, [blog_obj.path]);

    return (
      <div className="p-4 lg:p-10 min-h-full">
        <div className="flex justify-between items-center">
          <a href="/blogs" className="btn btn-ghost">
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
            Back to Blogs
          </a>
          <ThemeChanger
            loading={false}
            themeConfig={sanitizedConfig.themeConfig}
          />
        </div>
        <div className="card compact bg-base-100 shadow-lg mt-4">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div className="flex-grow text-center">
                {blog_obj.title && (
                  <h1 className="text-4xl font-bold mb-4">{blog_obj.title}</h1>
                )}
                {blog_obj.tags && blog_obj.tags.length > 0 && (
                  <div className="mb-1">
                    {blog_obj.tags.map((tag: Tag, index: number) => (
                      <span
                        key={index}
                        className="badge badge-primary mr-2 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {(blog_obj.date || blog_obj.ttr) && (
                  <div className="text-sm text-gray-500 mb-8">
                    {blog_obj.date && (
                      <span>
                        {new Date(blog_obj.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    )}
                    {blog_obj.date && blog_obj.ttr && (
                      <span className="mx-2">·</span>
                    )}
                    {blog_obj.ttr && (
                      <span>{Math.ceil(blog_obj.ttr / 60)} min read</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="max-w-4xl mx-auto prose">
              <MDXProvider components={components}>
                {Content ? <Content /> : <div>Loading...</div>}
              </MDXProvider>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Blog;
