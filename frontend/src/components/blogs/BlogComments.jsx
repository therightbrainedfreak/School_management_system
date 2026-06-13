import { ThreeDots } from "react-loader-spinner";
import { useState, useEffect, useRef } from "react";
import CommentActions from "./shards/CommentActions";
import { useAuth } from "../../context/AuthContext";

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

function BlogComments({ blogId, navigate }) {
    // states definition
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [isloading, setLoading] = useState(false);
    const [pagination, setPagination] = useState(null);
    const [comments, setComments] = useState([]);
    const { user } = useAuth();

    // function for fetching comments
    const fetchComments = async (controller) => {
        if (!blogId) return console.warn("returned hence blogid not given")
        if (isloading) return console.warn("returned hence data is loading")
        if (pagination && !pagination.hasNextPage) return console.warn("pagination data not found returning")

        setLoading(true)

        try {
            const uri = `/api/v1/comments/${blogId}/pagination?page=${page}&limit=${limit}`
            const req = await fetch(uri, {
                method: "GET",
                signal: controller.signal
            })
            const response = await req.json()
            if (!response.success) return

            setComments(prev => [...prev, ...response.data.comments])
            setPagination(response.data.pagination)

        } catch (error) {
            // ignore errors
        } finally {
            setLoading(false)
        }
    }

    // Sideeffect for fetching comments in relation with page.
    useEffect(() => {
        const controller = new AbortController();
        fetchComments(controller)
        return () => controller.abort()
    }, [])

    const toggleCommentLike = async (commentId) => {
        if (!user) return navigate('/auth?action=login')

        try {
            const uri = `/api/v1/comments/${commentId}/like`;
            const req = await fetch(uri, {
                method: "POST",
                credentials: "include"
            });
            const response = await req.json();
            if (response.success) {
                setComments(prev =>
                    prev.map(comment =>
                        comment.commentId === commentId
                            ? { ...comment, isLiked: response.data.liked, likesCount: response.data.likesCount }
                            : comment
                    )
                );
            } else {
                // ignore everything else
            }
        } catch (error) { }
    }

    if (isloading) {
        return (
            <div className="flex items-center justify-center py-6">
                <Loader />
            </div>
        )
    }

    if (comments.length <= 0) {
        return (
            "Not found"
        )
    }

    return comments.map((comment) => (
        <div key={comment.commentId} className="flex gap-2 my-2">
            <div className="text-[14px] flex flex-col gap-1 justify-center">
                <div className="flex gap-2 items-center">
                    <div className="border border-gray-400 rounded-full w-5 h-5 overflow-hidden">
                        <img src="https://placehold.co/18" alt="profile-picture" />
                    </div>
                    <div className="flex gap-2 items-center">
                        <span>{comment.author.name}</span><span className="text-gray-400">{comment.createdAt}</span>
                    </div>
                </div>
                <div className="ml-7">
                    <p className="text-sm">{comment.content}</p>
                    {comment.isAvailable ? <CommentActions comment={comment} toggleCommentLike={toggleCommentLike} /> : ""}
                </div>
                <div className="replies-button">
                    
                </div>
            </div>
        </div>
    ))
}

export default BlogComments