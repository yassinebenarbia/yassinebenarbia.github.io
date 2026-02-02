import SpaceButton from "../blogs-button";

const SpaceButtons = ({
  blogs_header,
  books_header,
  googleAnalyticId,
}: {
  blogs_header: string;
  books_header: string;
  googleAnalyticId?: string;
}) => {
  return (
    <div className="flex flex-col xl:flex-row items-center justify-center gap-1 py-2 px-1 w-full">
      <div className="flex-grow font-medium flex items-center">
        <SpaceButton
          externalProjects={[]}
          header={blogs_header}
          href={"/#/blogs"}
          loading={false}
        />
      </div>

      <div className="flex-grow justify-start px-1 items-center">
        <SpaceButton
          externalProjects={[]}
          header={books_header}
          href={"/#/books"}
          googleAnalyticId={googleAnalyticId}
          loading={false}
        />
      </div>
    </div>
  )
}

export default SpaceButtons;
