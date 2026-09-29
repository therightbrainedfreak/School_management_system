import { IoMdSearch } from "react-icons/io";
import { FaFilter, FaTags } from "react-icons/fa";
import { RiAccountCircle2Line, RiAddCircleLine } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import SearchSuggestions from "./shards/SearchSuggestion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BlogsNavbar({fetchBlogs}) {
    const [ isSearchFocused, setSearchFocus ] = useState(false);
    const [ query, setQuery ] = useState('');

    const navigate = useNavigate();

    function handelSearch(e) {
        e.preventDefault()
        
        const controller = new AbortController()
        fetchBlogs(controller, query)
    }

    return (
        <div className=" flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-xl font-bold">BLOGS</h1>
                <div className="flex gap-2 items-center justify-center">
                    <button
                    onClick={()=>{navigate('/blogs/compose')}}
                    className="t-bg hover:bg-primary-400 shadow-el-2 text-copy text-sm flex items-center justify-center gap-1 bg-primary-300 rounded-md h-9 pl-4 pr-3">
                        Compose <RiAddCircleLine size={"18px"}/>
                    </button>
                    <button
                    onClick={()=>{navigate('/blogs/mine')}}
                    className="t-bg hover:bg-primary-400 shadow-el-2 text-copy text-sm flex items-center justify-center gap-1 bg-primary-300 rounded-md h-9 pl-4 pr-3">
                        Mine <RiAccountCircle2Line size={"18px"}/>
                    </button>
                </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-row items-center gap-2">
                    <div className="hover:bg-primary-400 shadow-el-2 text-copy flex items-center justify-center bg-primary-300 rounded-md p-3">
                        <FaFilter size={"10px"} />
                    </div>
                </div>
                <form className="searchBlogs relative w-full flex flex-row items-center rounded-md" onSubmit={handelSearch}>
                    <input
                        onFocus={()=>{setSearchFocus(true)}}
                        onBlur={()=>{setSearchFocus(false)}}
                        className="bg-gray-200 text-gray-800 px-3 py-2 rounded-tl-md rounded-bl-md text-sm outline-0 w-full" name="search" type="text" placeholder="Search Articles, Ideas"
                        onInput={(e)=>{setQuery(e.target.value)}}
                        value={query}
                        autoComplete="off"
                    />
                    <button className="bg-primary-300 text-copy rounded-tr-md rounded-br-md h-9 w-10 flex items-center justify-center" type="submit">
                        <IoMdSearch size={"20px"} />
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