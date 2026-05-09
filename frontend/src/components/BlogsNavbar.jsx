import { CiSearch } from "react-icons/ci";
import { FaFilter, FaTags } from "react-icons/fa";
import { RiAccountCircle2Line, RiAddCircleLine } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import SearchSuggestions from "./shards/SearchSuggestion";
import { useState } from "react";

function BlogsNavbar() {
    const [ isSearchFocused, setSearchFocus ] = useState(false);
    const [ query, setQuery ] = useState('');
    function handelSearch(e) {
        e.preventDefault()
        alert("Submit Prevented!")
    }

    return (
        <div className="max-sm:mx-4 flex flex-col py-2 gap-2">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-xl font-bold">Blogs</h1>
                <div className="flex gap-2 items-center justify-center">
                    <button className="t-bg hover:bg-mauve-900 hover:text-white flex items-center justify-center gap-1 bg-gray-200 rounded-md h-9 pl-4 pr-3">
                        Compose <RiAddCircleLine size={"18px"}/>
                    </button>
                    <button className="t-bg hover:bg-mauve-900 hover:text-white box-border flex items-center justify-center gap-1 bg-gray-200 rounded-md h-9 pl-4 pr-3">
                        Mine <RiAccountCircle2Line size={"18px"}/>
                    </button>
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
                <form className="searchBlogs relative w-fit flex flex-row items-center" onSubmit={handelSearch}>
                    <input
                        onFocus={()=>{setSearchFocus(true)}}
                        onBlur={()=>{setSearchFocus(false)}}
                        className="bg-gray-200 px-3 py-2 rounded-tl-md rounded-bl-md text-sm outline-0" name="search" type="text" placeholder="Search"
                        onInput={(e)=>{setQuery(e.target.value)}}
                    />
                    <button className="bg-mauve-900 text-white rounded-tr-md rounded-br-md h-9 w-10 flex items-center justify-center" type="submit">
                        <CiSearch size={"18px"} />
                    </button>
                    <AnimatePresence>
                        {isSearchFocused ? <SearchSuggestions query={query} setQuery={setQuery} /> : ""}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    )
}

export default BlogsNavbar