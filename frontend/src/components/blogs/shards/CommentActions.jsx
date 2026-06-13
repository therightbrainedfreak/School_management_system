import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { FaReply } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdError } from "react-icons/md";

function CommentActions({ comment, toggleCommentLike }) {
    return (
        <div className="flex gap-2 select-none">
            <button onClick={()=>{toggleCommentLike(comment.commentId)}} className="text-[12px] flex gap-0.5 items-center justify-center">
                { comment.isLiked ? <IoHeart size={"12px"} /> : <IoHeartOutline size={"12px"} /> } {comment.likesCount}
            </button>
            <button className="text-[12px] flex gap-0.5 items-center justify-center">
                <FaReply size={"12px"} /> Reply
            </button>
            {comment.isOwned
                ? <button className="text-[12px] flex gap-0.5 items-center justify-center">
                    <MdEdit size={"12px"} /> Edit
                </button>
                : ""
            }
            {comment.isOwned
                ? <button className="text-[12px] flex gap-0.5 items-center justify-center">
                    <MdDelete size={"12px"} /> Delete
                </button>
                : ""
            }
            <button className="text-[12px] flex gap-0.5 items-center justify-center">
                <MdError size={"12px"} /> Report
            </button>
        </div>
    )
}

export default CommentActions