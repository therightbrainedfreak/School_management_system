import { useState } from "react";
import { FaRegClock } from "react-icons/fa6";
import { MdFileDownloadDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";


function MyBlogsNavbar() {
    return (
        <div className="py-2 flex flex-col items-start">
            <div className="text-2xl underline font-bold">My Blogs</div>
            <div>View and manage your content.</div>
        </div>
    )
}

export default MyBlogsNavbar