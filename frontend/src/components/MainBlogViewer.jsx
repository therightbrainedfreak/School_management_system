import { useSearchParams, useNavigate } from "react-router-dom"

function MainBlogViewer() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const blogId = searchParams.get('blogId');
    if (!blogId) return <div className="text-red-500 text-center">Invalid parameters</div>
    return (
        "This is the blog view screen"
    )
}

export default MainBlogViewer