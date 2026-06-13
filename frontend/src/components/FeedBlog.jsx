import { MdOutlineAccountCircle } from "react-icons/md";
import { IoHeart } from "react-icons/io5";
import { PiReadCvLogoFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

function FeedBlog({ blogs }) {
    const navigate = useNavigate();

    return blogs.map(({ createdAt, author, metadata, title, blogId }) => (
        <div key={blogId} onClick={() => {
            navigate(`/blogs/view?blogId=${blogId}`)
        }} className="relative bg-gray-100 rounded-lg p-3 cursor-pointer hover:bg-gray-200 transition-colors shadow-sm shadow-gray-300">
            <div className="text-[12px] text-blue-600">{metadata.category}</div>
            <div className="text-xl wrap-break-word font-bold leading-6 my-2">{title}</div>

            <div className="flex flex-row items-center justify-center w-fit gap-1 mb-2">
                <div className="text-[12px] text-blue-600">{`${author.name}, ${author.role.slice(0, 1).toUpperCase() + author.role.slice(1)} ${createdAt}`}</div>
            </div>
            <div className="flex flex-row items-center justify-center w-fit gap-1">
                <IoHeart className="text-gray-800" size={'16px'} />
                <div className="text-[12px]">{metadata.likes}</div>
                <PiReadCvLogoFill className="text-gray-800" size={'16px'} />
                <div className="text-[12px]">{metadata.reads}</div>
            </div>
        </div>
    ))
}

export default FeedBlog