import { useState } from "react"
import { ThreeDots } from "react-loader-spinner";
import CommentActions from "./CommentActions";
import { useAuth } from "../../../context/AuthContext";

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

function CommentReplies({ repliesCount, commentId }) {
    const [isRepliesExpanded, setRepliesView] = useState(false);
    const [isRepliesLoading, setRepliesLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [replies, setReplies] = useState([]);
    const { user } = useAuth();

    const loadReplies = async (commentId) => {
        const uri = `/api/v1/comments/${commentId}/replies?limit=8&page=${page}`;
        const request = await fetch(uri);
        setRepliesLoading(true);
        try {
            const response = await request.json();
            if (!request.ok) {
                return;
            }
            if (!response.success) {
                return;
            }
            setReplies(response.data.replies)
        } catch (error) {
            return;
        } finally {
            setRepliesLoading(false);
        }
    }

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
                setReplies(prev =>
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

    const RepliesMapper = () => {
        if (isRepliesLoading) {
            return (
                <Loader />
            )
        }

        return replies.map((cur) => (
        <div key={cur.commentId} className={`${ isRepliesExpanded ? "flex" : "hidden" } gap-2 my-2`}>
            <div className="text-[14px] flex flex-col gap-1 justify-center">
                <div className="flex gap-2 items-center">
                    <div className="border border-gray-400 rounded-full w-5 h-5 overflow-hidden">
                        <img src="https://placehold.co/18" alt="profile-picture" />
                    </div>
                    <div className="flex gap-2 items-center">
                        <span>{cur.author.name}</span><span className="text-gray-400">{cur.createdAt}</span>
                    </div>
                </div>
                <div className="ml-7">
                    <p className="text-sm my-1">{cur.content}</p>
                    {cur.isAvailable ? <CommentActions comment={cur} toggleCommentLike={toggleCommentLike} /> : ""}
                </div>
            </div>
        </div>
        ))
    }

    const toggleReplyLike = async (commentId) => {
        if (!user) return navigate('/auth?action=login')

        try {
            const uri = `/api/v1/comments/${commentId}/like`;
            const req = await fetch(uri, {
                method: "POST",
                credentials: "include"
            });
            const response = await req.json();
            if (response.success) {
                setReplies(prev =>
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

    return (
        <div className="ml-14">
            <div>
                <RepliesMapper />
            </div>
            <div className={`${repliesCount > 0 ? "flex" : "hidden"} flex-row items-center justify-start gap-1 cursor-pointer`} onClick={() => { setRepliesView(!isRepliesExpanded) }}>
                <div className="border-t border-gray-500 w-6"></div>
                <div onClick={!isRepliesExpanded ? () => { loadReplies(commentId) } : null} className="text-[12px] text-gray-500">
                    {isRepliesExpanded ? "Hide replies" : "Show replies"}
                </div>
            </div>
        </div>
    )
}

export default CommentReplies