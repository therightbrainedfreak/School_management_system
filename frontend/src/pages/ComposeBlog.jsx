import BlogEditor from "../components/BlogEditor"

function ComposeBlog() {
    return (
        <BlogEditor type={'new'} pTitle={"Compose"} allowDraft={true} submissionPath={'/api/v1/blogs'}/>
    )
}

export default ComposeBlog