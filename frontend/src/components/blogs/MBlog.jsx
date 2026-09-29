import { MdOutlineAccountCircle } from "react-icons/md";

function MBlog({ cAt, uAt, author, metadata, status, title, blogId, setSearchParams }) {
    return (
        <div onClick={() => setSearchParams({ view: blogId })} className="relative bg-page rounded-lg p-4 cursor-pointer transition-colors shadow-el-2">

            <div className="flex flex-row items-start justify-between gap-2">
                <div className="text-xl wrap-break-word font-bold leading-7">{title}</div>
            </div>
            <div className="mt-2 flex flex-row gap-2">
                <div className="text-[12px] w-fit h-fit rounded-sm border px-1">{status.state}</div>
                <div className="text-[12px]">
                    <span>Created On: {cAt}</span>
                </div>
            </div>
        </div>
    )
}

export default MBlog