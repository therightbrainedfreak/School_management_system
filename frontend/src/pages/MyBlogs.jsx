import MyBlogsNavbar from "../components/MyBlogsNavbar"
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useEffect, useState } from "react"
import { ThreeDots } from "react-loader-spinner";
import MBlog from "../components/MBlog";
import { useSearchParams } from "react-router-dom";
import MBlogView from "../components/MBlogView";

function MyBlogs() {
    const [isBlogsLoading, setBlogsLoading] = useState(true)
    const [blogs, setBlogs] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const viewId = searchParams.get('view')

    useEffect(() => {
        const controller = new AbortController()

        const fetchBlogs = async () => {
            try {
                setBlogsLoading(true);
                const path = '/api/v1/blogs/mine'
                const request = await fetch(path, {
                    signal: controller.signal,
                    credentials: 'include'
                })
                const response = await request.json();
                if (!response.success) {
                    setBlogs([])
                    toast.error(response.error.message)
                    return
                }
                setBlogs(response.data.blogs)
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted')  // ignore abort errors
                } else {
                    console.error(error)
                    toast.error('Something went wrong')
                }
            } finally {
                setBlogsLoading(false)
            }
        }

        fetchBlogs()

        return () => controller.abort();
    }, [])

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
                    wrapperStyle={{}}
                    wrapperClass="l-wrapper" />
            </div>
        )
    }

    const RenBlogs = () => {
        if (isBlogsLoading) return <Loader />

        return blogs.map((b) => (
            <MBlog cAt={b.createdAt} uAt={b.updatedAt} setSearchParams={setSearchParams} key={b.blogId} blogId={b.blogId} metadata={b.metadata} author={b.author} status={b.status} title={b.title}/>
        ))
    }

    if (viewId) {
        return (
            <MBlogView blogId={viewId} setSearchParams={setSearchParams} />
        )
    }

    return (
        <div className="max-sm:mx-4">

            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                closeButton={false}
                closeOnClick={false}
                pauseOnFocusLoss
                pauseOnHover
                draggable
                draggablePercent={20}
            />

            <MyBlogsNavbar/>
            <div className="flex flex-col gap-2 my-2">
                <RenBlogs/>
            </div>
        </div>
    )
}

export default MyBlogs