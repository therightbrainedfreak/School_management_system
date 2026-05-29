import { MdOutlineAccountCircle } from "react-icons/md";
import { IoHeart } from "react-icons/io5";
import { PiReadCvLogoFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

function FeedBlog({ blogs }) {
    const navigate = useNavigate();

    return blogs.map(({ createdAt, author, metadata, title, blogId }) => (
        <div key={blogId} onClick={() => {
            navigate(`/blogs/view?blogId=${blogId}`)
        }} className="relative bg-gray-100 rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition-colors shadow-sm shadow-gray-300">

            <div className="text-xl wrap-break-word font-bold leading-5">{title}</div>
            <div className="text-[16px] my-1">{metadata.category}</div>
            <div className="flex flex-row items-center justify-center w-fit gap-1 mb-1">
                <MdOutlineAccountCircle size={'12px'} />
                <div className="text-[10px]">{`${author.name.toUpperCase()}, ${author.role.toUpperCase()}`}</div>
            </div>
            <div className="flex flex-row items-center justify-center w-fit gap-1">
                <IoHeart className="text-gray-800" size={'12px'} />
                <div className="text-[10px]">{metadata.likes}</div>
                <PiReadCvLogoFill className="text-gray-800" size={'12px'} />
                <div className="text-[10px]">{metadata.likes}</div>
            </div>
            <div className="border px-0.5 rounded-sm leading-3 absolute right-2 bottom-2 text-[10px] flex flex-col mt-1">
                <span>{createdAt}</span>
            </div>
        </div>
    ))
}

export default FeedBlog