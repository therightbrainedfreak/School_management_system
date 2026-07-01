import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"
import { ThreeDots } from "react-loader-spinner";
import ContentView from "./shards/ContentView";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { PiReadCvLogo, PiReadCvLogoFill } from 'react-icons/pi'
import { IoIosShareAlt } from "react-icons/io";
import { MdError } from "react-icons/md";
import { BiCommentDetail } from "react-icons/bi";
import BlogComments from "./BlogComments";
import { useAuth } from '../../context/AuthContext';
import { BiX } from "react-icons/bi"

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

function MainBlogViewer() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuth();
    const blogId = searchParams.get('blogId');
    if (!blogId) return <div className="text-red-500 text-center">Invalid parameters</div>

    // data states
    const [isLoading, setLoading] = useState(true);
    const [blog, setBlog] = useState({});
    const [isBlogFound, setBlogFound] = useState(true);

    // Initial blog load
    useEffect(() => {
        const controller = new AbortController();
        async function fetchBlog() {
            try {
                setLoading(true);
                const uri = `/api/v1/blogs-latest/${blogId}`;
                const req = await fetch(uri, {
                    method: "GET",
                    signal: controller.signal
                })
                const response = await req.json();
                if (!response.success) {
                    if (response.error.code === "NOT_FOUND") {
                        setBlogFound(false);
                    }
                    null
                } else {
                    setBlogFound(true);
                    setBlog(response.data.blog);
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted')  // ignore abort errors
                } else {
                    console.error(error)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchBlog()
        return () => controller.abort();
    }, [])

    const postComment = async () => {
        // New comment body = isReply [Boolean], parentCommentId [String], content [String]

    }

    const recordRead = async () => {
        if (!isBlogFound) return
        try {
            const uri = `/api/v1/blogs-latest/${blogId}/read`;
            const req = await fetch(uri, {
                method: "PUT",
                credentials: 'include'
            })
            const response = await req.json();
            if (response.success) {
                // setBlog(prev => ({ ...prev, metadata: { ...prev.metadata, reads: prev.metadata.reads + 1 } }))
            } else {
                // ignore read registration failure
            }
        } catch (error) {
            // Ignore read registraion errors
        }
    }

    const clearReply = () => {
        setReplying(false);
        setParent({});
    }

    const toggleLike = async () => {
        if (!isBlogFound) return
        if (!user) return navigate('/auth?action=login')
        try {
            const uri = `/api/v1/blogs-latest/${blogId}/like`
            const req = await fetch(uri, {
                method: "POST",
                credentials: "include"
            })
            const response = await req.json();
            if (response.success) {
                setBlog(prev => ({
                    ...prev,
                    metadata: {
                        ...prev.metadata,
                        likes: prev.metadata.likes = response.data.likesCount,
                        isLiked: prev.metadata.isLiked = response.data.liked
                    }
                }));
            } else {
                // ignore error
            }
        } catch (error) {
            // ignore error
        }
    }

    if (isLoading) return <div className="w-full grid place-items-center my-8"><Loader /></div>

    if (!isLoading && !isBlogFound) {
        return (
            <div className="flex flex-col items-center justify-center max-sm:mx-4 py-20 gap-8">
                <img className="w-80" src="/404.svg" alt="empty" />
                <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className="text-xl text-bold">Reqested content not found!</h1>
                    <button className="text-white bg-gray-800 px-4 py-2 rounded-md">Home</button>
                </div>
            </div>
        )
    }

    if (!blog.author) return <div className="w-full grid place-items-center my-8"><Loader /></div>

    return (
        <div className="max-sm:mx-4 my-2 flex flex-col gap-2">
            <ContentView htmlContent={blog.content} title={blog.title} recordRead={recordRead} />
            <div className="actions my-2 py-2">

                <div className="flex flex-col gap-2 items-start justify-start">

                    <div aria-label="actions" className="flex items-center gap-2">
                        <div onClick={() => { toggleLike() }} className="hover:bg-gray-800 hover:text-white click:bg-gray-800 click:text-white cursor-pointer flex items-center justify-center select-none gap-1 border rounded-full py-1 pl-3 pr-3.5">
                            {blog.metadata.isLiked ? <IoHeart /> : <IoHeartOutline />}
                            {blog.metadata.likes}
                        </div>

                        <div className="flex items-center justify-center select-none gap-1 border rounded-full py-1 pl-3 pr-3.5">
                            {blog.metadata.isRead ? <PiReadCvLogoFill /> : <PiReadCvLogo />}
                            {blog.metadata.reads}
                        </div>

                        <div className="cursor-pointer flex items-center justify-center select-none gap-1 border rounded-full py-1 pl-3 pr-3.5">
                            <IoIosShareAlt /> Share
                        </div>

                        <div className="cursor-pointer flex items-center justify-center select-none gap-1 border rounded-full py-1 pl-3 pr-3.5">
                            <MdError /> Report
                        </div>
                    </div>
                </div>

                <div aria-label="author" className="flex flex-row items-center text-sm text-gray-600 mt-4 max-sm:-ml-3">
                    <p className="-rotate-90 text-[10px] font-bold border-b -mr-1">Author</p>
                    <div>
                        <p>{blog.author.name + ", " + blog.author.role.slice(0, 1).toUpperCase() + blog.author.role.slice(1)}</p>
                        <p>Published: {blog.createdAt}</p>
                    </div>
                </div>

                <div className="comments my-2" aria-label="comments">
                    <h1 className="my-1 py-1 border-b text-lg flex items-center gap-2"><BiCommentDetail /> Comments</h1>
                </div>

                <div className="flex flex-col w-full max-h-60 overflow-y-auto">
                    <BlogComments blogId={blogId} navigate={navigate} />
                </div>

                <div className="relative w-full bg-gray-200 rounded-md p-4 flex mt-4">
                    <input
                        className="w-full px-3 outline-0 border-l border-t border-b rounded-tl-md rounded-bl-md bg-white"
                        type="text"
                        placeholder="Comment"
                    />
                    <button onClick={() => { postComment() }} className="bg-gray-900 text-white px-4 py-2 rounded-tr-md rounded-br-md">
                        Post
                    </button>
                </div>

            </div>
        </div>
    )
}

export default MainBlogViewer