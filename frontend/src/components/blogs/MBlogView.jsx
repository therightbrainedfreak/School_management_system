import { useEffect, useState } from "react"
import { ThreeDots } from "react-loader-spinner"
import { MdEditNote, MdDelete } from "react-icons/md";
import { redirect, replace, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import Popup from "../../pages/dashboards/dashboard_components/Popup";
import { TiInfoOutline } from "react-icons/ti";

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
    const [isDeleteConfirmationOpen, setDeleteConfirmation] = useState(false);
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

            <div className="text-2xl font-bold underline mb-4 mt-4">
                Stats
            </div>

            <div className={`stats font-mono bg-page py-2 px-3 shadow-el-2 rounded-md mt-4 mb-4 ${blog.status.state === "REJECTED" ? 'border-t-red-400' : 'blog.status.state' === 'LIVE' ? 'bg-green-300' : 'bg-amber-200'}`}>
                <p className="text-sm">Current Status: {blog.status.state}</p>
                <p className="text-sm">Message: { blog.status.state === 'REJECTED' ? blog.status.reasonForRejection : messageMap[blog.status.state]}</p>
                <p className="text-sm">Likes: { blog.metadata.likes }</p>
                <p className="text-sm">Reads: { blog.metadata.reads || "undefined" } </p>
                <p className="text-sm">Created On: {blog.metadata.createdAt}</p>
                <p className="text-sm">Last Activity: {blog.metadata.updatedAt}</p>
            </div>

            <div className="text-2xl font-bold underline mb-4">
                Overview
            </div>
            
            <div className="mb-4">

                <h1 className="text-lg font-bold border-b-2 border-gray-400 pb-1">
                    {blog.title}
                </h1>

                <article className="special-content-div my-4 break-normal leading-6 flex flex-col gap-2" dangerouslySetInnerHTML={{__html: blog.content.replace(/&nbsp;/g, ' ')}}>
                </article>

            </div>

            <div className="text-2xl font-bold underline mb-4">
                Actions
            </div>

            <div className="flex gap-4 mb-4">
                <button onClick={()=>{navigate(`/blogs/${blogId}`, {replace: true})}} className="text-black w-fit flex flex-row items-center justify-center gap-1 bg-green-200 px-3 py-2 rounded-md"><MdEditNote size={"20px"}/> Edit</button>
                <button onClick={() => setDeleteConfirmation(true)} className="text-black w-fit flex flex-row items-center justify-center gap-1 bg-red-200 px-3 py-2 rounded-md"><MdDelete size={"20px"}/> Delete</button>
            </div>

            <Popup
                isOpen={isDeleteConfirmationOpen}
                onClose={() => setDeleteConfirmation(false)}
                title={"Confirmation"}>
                <div className="text-red-600 mt-2">Do you really want to delete ?</div>
                <div className="flex items-center justify-center flex-col gap-2 mt-3 mb-3">
                    <button className="border w-full rounded-sm p-1 text-center" onClick={() => setDeleteConfirmation(false)}>Cancel</button>
                    <div onClick={() => deleteBlog(blogId).then(() => redirect(-1))} className="underline">Delete</div>
                </div>
                <div className="text-gray-500 flex items-center gap-2">
                    <div className="mb-2"><TiInfoOutline size={"24px"} /></div>
                    <p className="text-sm">Deleting a blog does not permanently removes it from the system.</p>
                </div>
            </Popup>
            
        </div>
    )
}

export default MBlogView