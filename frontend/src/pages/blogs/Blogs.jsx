import { ThreeDots } from "react-loader-spinner"
import { useEffect, useState } from "react"
import PaginationNav from "../../components/blogs/shards/PaginationNav"
import FeedBlog from "../../components/FeedBlog"
import BlogsNavbar from "../../components/blogs/BlogsNavbar"

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

function Blogs() {
    const [isLoading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({})
    const [blogs, setBlogs] = useState([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(8)

    const fetchBlogs = async (controller, search) => {
        const uri = search ? `/api/v1/blogs-latest?page=${page}&limit=${limit}&search=${search}` : `/api/v1/blogs-latest?page=${page}&limit=${limit}`
        setLoading(true)
        try {
            const req = await fetch(uri, {
                method: "GET",
                signal: controller.signal
            })
            const response = await req.json()
            if (!response.success) {
                console.error('error getting blogs', response.error.message)
            } else {
                setBlogs(response.data.blogs)
                setPagination(response.data.pagination)
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted')  // ignore abort errors
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const controller = new AbortController();

        fetchBlogs(controller, null)

        return () => controller.abort()

    }, [page])

    return (
        <div className="mx-4 my-4 flex flex-col gap-4">
            <BlogsNavbar fetchBlogs={fetchBlogs}/>
            <div className="flex flex-col gap-3">
                {
                    isLoading
                        ? <div className="mx-4 my-6 grid place-content-center"><Loader /></div>
                        : <FeedBlog blogs={blogs} />
                }
            </div>
            <PaginationNav pagination={pagination} isLoading={isLoading} setPage={setPage} />
        </div>
    )
}

export default Blogs