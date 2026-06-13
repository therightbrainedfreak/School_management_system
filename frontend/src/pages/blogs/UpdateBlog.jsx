import { useState, useEffect } from "react";
import BlogEditor from "../../components/blogs/BlogEditor"
import { useParams } from "react-router-dom"
import { ThreeDots } from "react-loader-spinner";

function Loader() {
    return (
        <div className="l-wrapper">
            <ThreeDots
                visible={true}
                height="20"
                width="28"
                color="#000000"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperClass="l-wrapper" />
        </div>
    )
}

function UpdateBlog() {
    const { blogId } = useParams();
    if (!blogId) return <div>Error: Blog id is required</div>

    const submissionPath = `/api/v1/blogs/${blogId}`

    const [isBlogLoading, setBlogLoading] = useState(true);
    const [blog, setBlog] = useState({})


    useEffect(() => {
        if (!blogId) return console.error('Blog id not given')
        const controller = new AbortController()

        const fetchBlog = async () => {
            setBlogLoading(true)
            try {
                const path = `/api/v1/blogs/mine/${blogId}`
                const request = await fetch(path, {
                    signal: controller.signal,
                    credentials: 'include'
                })
                const response = await request.json();
                if (!response.success) {
                    console.log('Blog not loaded')
                } else {
                    setBlog(response.data.blog)
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted')  // ignore abort errors
                } else {
                    console.error(error)
                }
            } finally {
                setBlogLoading(false)
            }
        }

        fetchBlog()

        return () => controller.abort()
    }, [])

    if (isBlogLoading) return <div className="max-sm:mx-4 flex items-center justify-center py-10"><Loader/></div>
    if (!blog) return <div className="max-sm:mx-4 flex items-center justify-center py-10"><Loader/></div>

    return (
        <BlogEditor
            type={'update'}
            pTitle={"UPDATE"}
            allowDraft={false}
            submissionPath={submissionPath}
            blogId={blogId}
            blogData={blog}
            redirect={'/blogs/mine'}
        />
    )
}

export default UpdateBlog