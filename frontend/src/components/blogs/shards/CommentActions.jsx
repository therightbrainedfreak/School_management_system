import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { FaReply } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdError } from "react-icons/md";
import { useState } from "react";

function CommentActions({ comment, toggleCommentLike }) {
    const [ isRepliesExpanded, setRepliesView ] = useState(false);

    return (
        <div className="flex flex-col">
            <div className="flex gap-2 select-none">
                <button onClick={() => { toggleCommentLike(comment.commentId) }} className="text-[12px] flex gap-0.5 items-center justify-center">
                    {comment.isLiked ? <IoHeart size={"12px"} /> : <IoHeartOutline size={"12px"} />} {comment.likesCount}
                </button>
                <button onClick={()=>{}} className="text-[12px] flex gap-0.5 items-center justify-center">
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
            <div className="replies-container">

            </div>
            <div className={`${ comment.repliesCount > 0 ? "flex" : "hidden" } flex-row items-center justify-start gap-2 cursor-pointer`} onClick={()=>{setRepliesView(!isRepliesExpanded)}}>
                <div className="border-t border-gray-500 w-6"></div>
                <div className="text-[12px] text-gray-500">
                    { isRepliesExpanded ? "Hide replies" : "Show replies" }
                </div>
            </div>
        </div>
    )
}

export default CommentActions