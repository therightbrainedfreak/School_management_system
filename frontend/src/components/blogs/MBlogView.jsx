import { useEffect, useState } from "react"
import { ThreeDots } from "react-loader-spinner"
import { MdEditNote, MdDelete } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { replace, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';

// Loader for all tasks
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

// Main component
function MBlogView({blogId, setSearchParams}) {
    const [isBlogLoading, setBlogLoading] = useState(true)
    const [isDeleting, setDeleting] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
    const [blog, setBlog] = useState({})
    const navigate = useNavigate()
    const messageMap = {
        DRAFT: "Submitted, waiting for review",
        REVIEW: "Your blog is being reviewed",
        LIVE: "Your blog is Live",
        REJECTED: "Your Blog is rejected"
    }

    useEffect(() => {

        // Return if blog id is not present
        if (!blogId) return console.error('Blog id not given')

        const  controller = new AbortController()

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
                    toast.error(response.error.message, {autoClose: 1000})
                    await new Promise(resolve => setTimeout(resolve, 1100))
                    navigate(-1, {replace: true})
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

    const deleteBlog = async (id) => {
        if (!id) return console.error('no blog id passed')

        setDeleting(true);

        try {
            const req = await fetch(`/api/v1/blogs/${id}`, {method: 'DELETE', credentials: 'include'});
            const response = await req.json();

            if (!response.success) {
                toast.error(data.response.error.message)
            } else {
                toast.success('deleted blog', {autoClose: 1000})
                await new Promise(resolve => setTimeout(resolve, 1100));
                navigate(-1, {replace: true})
            }

        } catch (error) {
            null
        } finally {
            setDeleting(false)
        }
    }
    
    // dont show the content if the blog isn't loaded yet
    if (isBlogLoading) return <div className="max-sm:mx-4 flex items-center justify-center py-10"><Loader/></div>
    if (!blog.status) return <div className="max-sm:mx-4 flex items-center justify-center py-10"><Loader/></div>

    return (
        
        <div className="main-container max-sm:mx-4 border-md">

            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                closeButton={false}
                closeOnClick={false}
                pauseOnFocusLoss
                draggable
                draggablePercent={40}
            />

            <div
                onClick={() => setSearchParams({}, { replace: true })}
                className="bg-gray-200 font-black w-fit h-fit flex flex-row my-2 pl-3 pr-4 py-2 gap-2 rounded-md items-center justify-center"
            >
                <FaArrowLeft />
                Back

            </div>

            <div className=" rounded-md flex flex-col gap-0.5">

                <div className={`${blog.status.state === "REJECTED" ? 'bg-red-400' : blog.status.state === 'LIVE' ? 'bg-green-300' : 'bg-amber-200'} p-3 pb-1.5 rounded-md flex flex-col items-start gap-1 my-4`}>
                    <div className="px-1 border-2 w-fit rounded-sm font-bold text-[12px] select-none">
                        {blog.status.state}
                    </div>

                    <div className="text-gray-800">
                        {
                            blog.status.state === 'REJECTED'
                            ? blog.status.reasonForRejection
                            : messageMap[blog.status.state]
                        }
                    </div>
                </div>

            </div>
            
            <div className="mb-4">

                <h1 className="text-lg font-bold border-b-2 border-gray-400 pb-1">
                    {blog.title}
                </h1>

                <article className="special-content-div my-4 break-normal leading-6 flex flex-col gap-2" dangerouslySetInnerHTML={{__html: blog.content.replace(/&nbsp;/g, ' ')}}>
                </article>

                <h1>Author -</h1>
                <p>{`${blog.author.name}, ${blog.author.role}`}</p>

            </div>

            <div className="flex flex-col gap-4 mb-4">
                <button onClick={()=>{navigate(`/blogs/${blogId}`, {replace: true})}} className="w-fit flex flex-row items-center justify-center gap-1 bg-green-200 px-3 py-2 rounded-md"><MdEditNote size={"20px"}/> Edit</button>
                <div>
                    <h1>Delete this Blog</h1>
                    <p className="text-sm text-green-700">Deleting this blog doesn't permanently removes this from the system. Just makes it hidden to the all the ERP users.</p>
                    <p className="text-sm text-red-700">Action is not reversible</p>
                        <div>
                            {!deleteConfirmation
                                ? <p onClick={()=>{setDeleteConfirmation(!deleteConfirmation)}} className="underline select-none cursor-pointer">delete now</p>
                                : <div className="flex gap-4">
                                    <p onClick={()=>{setDeleteConfirmation(!deleteConfirmation)}} className="text-md text-gray-900 underline select-none cursor-pointer">Cancel</p>
                                    <p onClick={()=>{deleteBlog(blogId)}} className="text-sm select-none cursor-pointer">Delete</p>
                                </div>
                            }
                        </div>
                </div>
            </div>
            
        </div>
    )
}

export default MBlogView