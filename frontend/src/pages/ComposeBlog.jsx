import { useState, useEffect } from 'react'
import BlogEditor from '../components/BlogEditor'
import { AnimatePresence, motion } from 'framer-motion'
import { RiDraftFill } from "react-icons/ri";
import { MdOutlinePublish } from "react-icons/md";
import CategorySearchSuggestions from '../components/shards/CategorySuggestions';

function ComposeBlog() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('')
    const [tags, setTags] = useState([])

    const [categoryQuery, setCategoryQuery] = useState('')
    const [tagQuery, setTagQuery] = useState('')

    const [titleError, setTitleError] = useState('')
    const [contentError, setContentError] = useState('')
    const [categoryError, setCategoryError] = useState('')
    const [tagError, setTagError] = useState('')

    const [isCategoriesFieldFocused, setCategoriesFieldFocus] = useState(false)
    const [isTagsFieldFocused, setTagsFieldFocus] = useState(false)

    // Networking states.
    const [blogCategories, setBlogCategories] = useState([])
    const [isCategoriesLoading, setCategoriesLoading] = useState(true)
    const [isTagsLoading, setTagsLoading] = useState(true)
    
    useEffect(() => {
        const controller = new AbortController()

        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const request = await fetch('/api/v1/blogs/categories', {
                    signal: controller.signal
                })
                const response = await request.json();
                if (!response.success) {
                    setBlogCategories([])
                } else {
                    setBlogCategories(response.data.categories)
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted')  // ignore abort errors
                } else {
                    console.error(error)
                }
            } finally {
                setCategoriesLoading(false);
            }
        }

        fetchCategories()

        return () => controller.abort()
    }, [])



    return (
        <div className='mx-4'>
            <nav className='flex flex-row items-center justify-between my-2'>
                <h1 className='text-xl font-bold'>
                    Compose
                </h1>
                <div className='flex gap-2'>
                    <button className='flex flex-row items-center justify-center gap-1 bg-cyan-200 px-3 py-2 rounded-md select-none'>
                        <RiDraftFill size={"16px"} />
                        Save Draft
                    </button>
                    <button className='flex flex-row items-center justify-center gap-1 bg-green-200 px-3 py-2 rounded-md select-none'>
                        <MdOutlinePublish size={"18px"} />
                        Publish
                    </button>
                </div>
            </nav>
            <div className='py-2 flex flex-col gap-0.5'>

                <h1 className='text-lg font-bold flex gap-2 items-start'>
                    Title
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.2, ease: 'easeInOut'}}
                        className='text-sm font-normal text-red-500'
                    >
                        {titleError ? titleError : ""}
                    </motion.div>
                </h1>

                <input type="text"
                    className='outline-0 border-b border-gray-400 max-sm:w-full py-1'
                    placeholder='Title goes here'
                    onChange={(e)=>{
                        setTitle(e.target.value)
                    }}
                    value={title}
                />

            </div>

            <div className='py-2 flex flex-col gap-2'>

                <h1 className='text-lg font-bold flex gap-2 items-start'>
                    Content
                    <div className='text-sm font-normal text-red-500'>
                        {contentError ? contentError : ""}
                    </div>
                </h1>

                <BlogEditor onChange={setContent} />
            </div>

            <div className='py-2 flex flex-col gap-1 mb-8'>
                <h1 className='text-lg font-bold flex gap-2 items-start'>
                    Category
                    <div className='text-sm font-normal text-red-500'>
                        {categoryError ? categoryError : ""}
                    </div>
                </h1>
                <div className='relative flex flex-col gap-2 w-fit'>
                    <div className={`${category ? "" : "hidden"} bg-gray-100 font border w-fit px-1.5 rounded-md select-none`}>
                        {category.toUpperCase()}
                    </div>
                    <input
                        className='py-1 border-b border-gray-400 w-full outline-0'
                        type="text"
                        placeholder='Category'
                        onFocus={()=>{setCategoriesFieldFocus(true)}}
                        onBlur={()=>{setCategoriesFieldFocus(false)}}
                        onChange={(e)=>{
                            setCategoryQuery(e.target.value)
                        }}
                        value={categoryQuery}
                    />
                    <CategorySearchSuggestions query={categoryQuery} setQuery={setCategoryQuery} setCategory={setCategory} categories={blogCategories}/>
                </div>
            </div>
        </div>
    )
}

export default ComposeBlog