import BlogEditor from "../components/BlogEditor"

function ComposeBlog() {
    return (
        <BlogEditor
            type={'new'}
            pTitle={"Compose"}
            allowDraft={true}
            submissionPath={'/api/v1/blogs'}
            redirect={'/blogs/mine'}
        />
    )
}

export default ComposeBlog