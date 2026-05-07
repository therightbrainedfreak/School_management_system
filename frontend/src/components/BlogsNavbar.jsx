import { CiSearch } from "react-icons/ci";
import { FaFilter, FaTags } from "react-icons/fa";

function BlogsNavbar() {
    function handelSearch(e) {
        e.preventDefault()
        alert("Submit Prevented!")
    }
    return (
        <div className="max-sm:mx-4 flex flex-col py-2 gap-2">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-lg font-bold">Blogs</h1>
                <div>
                    these are the buttons
                </div>
            </div>
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                    <div className="bg-gray-200 rounded-md h-9 w-10 flex items-center justify-center">
                        <FaFilter size={"10px"} />
                    </div>
                    <div className="bg-gray-200 rounded-md h-9 w-10 flex items-center justify-center">
                        <FaTags size={"11px"} />
                    </div>
                </div>
                <form className="searchBlogs w-fit flex flex-row items-center gap-2" onSubmit={handelSearch}>
                    <input className="bg-gray-200 px-3 py-2 rounded-md text-sm outline-0" name="search" type="text" placeholder="Search" />
                    <button className="bg-gray-200 rounded-md h-9 w-10 flex items-center justify-center" type="submit">
                        <CiSearch size={"18px"} />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default BlogsNavbar