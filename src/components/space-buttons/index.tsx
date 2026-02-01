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
    < div className="flex justify-start py-2 px-1 items-center" >
      <SpaceButton
        externalProjects={[]}
        header={blogs_header}
        href={"/#/blogs"}
        loading={false}
      />
      <SpaceButton
        externalProjects={[]}
        header={books_header}
        href={"/#/books"}
        googleAnalyticId={googleAnalyticId}
        loading={false}
      />
    </div >
  )
}

export default SpaceButtons;
