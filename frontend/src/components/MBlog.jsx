import { MdOutlineAccountCircle } from "react-icons/md";

function MBlog({cAt, uAt, author, metadata, status, title, blogId, setSearchParams}) {
    return (
        
        <div onClick={() => setSearchParams({ view: blogId })} className="relative bg-gray-100 rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition-colors">
            
            <div className="flex flex-row items-start justify-between gap-2">
                <div className="text-lg wrap-break-word font-bold leading-5">{title}</div>
                <div className="text-[10px] w-fit h-fit rounded-sm border px-1">{status.state}</div>
            </div>
            <div className="text-sm my-1">{metadata.category}</div>
            <div className="flex flex-row items-center justify-center w-fit gap-1">
                <MdOutlineAccountCircle size={'14px'}/>
                <div className="text-sm">{`${author.name.toLowerCase()}, ${author.role}`}</div>
            </div>
            <div className="absolute right-2 bottom-2 text-[10px] flex flex-col mt-1">
                <span>CR: {cAt}</span>
                <span>LU: {uAt}</span>
            </div>
        </div>
    )
}

export default MBlog