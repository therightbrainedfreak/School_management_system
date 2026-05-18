import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RiDraftFill } from "react-icons/ri";
import { MdOutlinePublish } from "react-icons/md";
import CategorySearchSuggestions from '../components/shards/CategorySuggestions';
import TagSearchSuggestions from '../components/shards/TagSuggestions';
import { IoCloseOutline } from "react-icons/io5";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { ThreeDots } from "react-loader-spinner";
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

function BlogEditor({ pTitle, type, allowDraft, blogId, blogData, submissionPath }) {

    if (type === "update") {
        if (!blogId) return <div>Error: Blog Id is required for update</div>
        if (!blogData) return <div>Error: Blog data is required for update</div>
        if (!submissionPath) return <div>Error: Submission path required</div>
    }

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('')
    const [tags, setTags] = useState([])

    // Query states
    const [categoryQuery, setCategoryQuery] = useState('')
    const [tagQuery, setTagQuery] = useState('')

    // Error states
    const [titleError, setTitleError] = useState('')
    const [contentError, setContentError] = useState('')
    const [categoryError, setCategoryError] = useState('')
    const [tagError, setTagError] = useState('')

    // Focuse stated
    const [isTitleFieldFocused, setTitleFieldFocus] = useState(false);
    const [isCategoriesFieldFocused, setCategoriesFieldFocus] = useState(false)
    const [isTagsFieldFocused, setTagsFieldFocus] = useState(false)
    const [isContentFieldFocused, setContentFieldFocus] = useState(false)
    const [isPublishing, setPublishing] = useState(false);

    // Networking states.
    const [blogCategories, setBlogCategories] = useState([])
    const [isCategoriesLoading, setCategoriesLoading] = useState(true)
    const [isTagsLoading, setTagsLoading] = useState(true)
    const [blogTags, setBlogTags] = useState([])

    const [isSavingDraft, setSavingDraft] = useState(false);

    useEffect(() => {
        if (allowDraft !== true) return;
        const savedDraft = localStorage.getItem('draftBlog');
        if (!savedDraft) return;

        try {
            const parsed = JSON.parse(savedDraft);
            setTitle(parsed.title || '');
            setContent(parsed.content || '');
            setCategory(parsed.category || '');
            setTags(parsed.tags || []);
        } catch (e) {
            console.warn('Could not parse saved draft:', e);
        }
    }, []);

    useEffect(() => {
        if (type !== "update" || !blogData || !blogData.metadata) return;
        setTitle(blogData.title || '');
        setContent(blogData.content || '');
        setCategory(blogData.metadata?.category || '');
        setTags(blogData.metadata?.tags || []);
    }, [blogData]);

    useEffect(() => {
        const tagsController = new AbortController()

        const fetchTags = async () => {
            try {
                setTagsLoading(true)
                const request = await fetch('/api/v1/blogs/tags', {
                    signal: tagsController.signal
                })
                const response = await request.json()
                if (!response.success) {
                    setBlogTags([]);
                } else {
                    setBlogTags(response.data.tags)
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted')  // ignore abort errors
                } else {
                    console.error(error)
                }
            } finally {
                setTagsLoading(false)
            }
        }

        fetchTags()

        return () => tagsController.abort()
    }, [])

    useEffect(() => {
        const CategoriesController = new AbortController()

        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const request = await fetch('/api/v1/blogs/categories', {
                    signal: CategoriesController.signal
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

        return () => CategoriesController.abort()
    }, [])

    const handleTitle = (e) => {
        const value = e.target.value
        setTitle(value)

        const cleaned = value.trim();
        const wordCount = cleaned === "" ? 0 : cleaned.split(/\s+/).length;
        if (wordCount < 3) {
            setTitleError("Title must be at least 3 words long");
        } else {
            setTitleError(""); // Safely clears error immediately
        }
    }

    const saveDraft = () => {
        const payload = {
            title: title || '',
            content: content || '',
            category: category || '',
            tags: tags || '',
        }
        const toJson = JSON.stringify(payload)
        localStorage.setItem('draftBlog', toJson);
        toast.success('Saved Draft!')
    }

    const DraftButton = () => {
        return (
            <button onClick={() => { saveDraft() }} className='cursor-pointer flex items-center justify-center bg-cyan-200 px-3 py-2 rounded-md select-none w-30'>
                {
                    isSavingDraft
                        ? <Loader />
                        : <div className='flex flex-row items-center justify-center gap-1'><RiDraftFill size={"16px"} />Save Draft</div>
                }
            </button>
        )
    }

    const FinalButton = () => {
        return (
            <button onClick={() => { publishBlog() }} className='cursor-pointer flex flex-row items-center justify-center gap-1 bg-green-200 px-3 py-2 rounded-md select-none w-25'>
                {
                    isPublishing
                        ? <Loader />
                        : <div className='flex flex-row items-center justify-center gap-1'><MdOutlinePublish size={"18px"} />{type === "new" ? "Publish" : "Done"}</div>
                }
            </button>
        )
    }

    const Loader = () => {
        return (
            <div className="l-wrapper">
                <ThreeDots
                    visible={true}
                    height="20"
                    width="28"
                    color="#000000"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass="l-wrapper" />
            </div>
        )
    }

    const publishBlog = () => {
        setPublishing(true)

        const publish = async (payload) => {
            try {
                const parsedPayload = JSON.stringify(payload);
                const request = await fetch(submissionPath, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: parsedPayload
                })
                const response = await request.json();
                if (!response.success) {
                    const msg = response.error.message
                    toast.error(msg)
                } else {
                    const cnf = response.data.message
                    toast.success(cnf)
                    setTitle('')
                    setCategory('')
                    setContent('')
                    setTags([])
                    localStorage.removeItem('draftBlog')
                }
            } catch (error) {
                console.warn(error.message)
            } finally {
                setPublishing(false)
            }
        }

        const t = title || undefined;
        if (!t) setTitleError('Title cannot be empty')
        const ct = content || undefined;
        if (!ct) setTitleError('Content cannot be empty')
        const cg = category || undefined
        if (!cg) setCategoryError('Category required')
        const tg = tags || []
        if (tg.length <= 0) setTagError('Tags cannot be empty')

        if (!t || !ct || !cg || tg.length <= 0) {
            toast.warn('Please correct the errors')
            setPublishing(false)
            return
        }

        const payload = {
            category: category,
            title: title,
            content: content,
            tags: tags,
            isNew: type === "new" ? true : false
        }

        publish(payload)

    }

    return (
        <div className='mx-4'>

            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                closeButton={false}
                closeOnClick={false}
                pauseOnFocusLoss
                pauseOnHover
                draggable
                draggablePercent={20}
            />

            <nav className='flex flex-row items-center justify-between my-2'>
                <h1 className='text-xl font-bold'>
                    {pTitle.toUpperCase()}
                </h1>
                <div className='flex gap-2'>
                    {allowDraft ? <DraftButton /> : ""}
                    <FinalButton />
                </div>
            </nav>
            <div className='py-2 flex flex-col gap-0.5'>

                <h1 className='text-lg font-bold flex gap-2 items-start'>
                    Title
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className='text-sm font-normal text-red-500'
                    >
                        {titleError ? titleError : ""}
                    </motion.div>
                </h1>

                <input type="text"
                    className='outline-0 border-b border-gray-400 max-sm:w-full py-1'
                    placeholder='Title goes here'
                    onFocus={() => { setTitleFieldFocus(true); setTitleError('') }}
                    onBlur={() => setTitleFieldFocus(false)}
                    onChange={handleTitle}
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

                <ReactQuill
                    value={content}
                    onFocus={() => { setContentFieldFocus(true); setContentError('') }}
                    onBlur={() => { setContentFieldFocus(false) }}
                    theme="snow"
                    onChange={(html) => { setContent(html) }}
                    placeholder="Start writing..."
                />
            </div>

            <div className='py-2 flex flex-col gap-1'>
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
                        placeholder='Start typing for suggestions'
                        onFocus={() => { setCategoriesFieldFocus(true); setCategoryError('') }}
                        onBlur={() => { setCategoriesFieldFocus(false) }}
                        onChange={(e) => {
                            setCategoryQuery(e.target.value)
                        }}
                        value={categoryQuery}
                    />
                    <CategorySearchSuggestions query={categoryQuery} setQuery={setCategoryQuery} setCategory={setCategory} categories={blogCategories} isLoading={isCategoriesLoading} />
                </div>
            </div>

            <div className='py-2 flex flex-col gap-1 mb-8'>
                <h1 className='text-lg font-bold flex gap-2 items-start'>
                    Tags
                    <div className='text-sm font-normal text-red-500'>
                        {tagError ? tagError : ""}
                    </div>
                </h1>
                <div className='relative flex flex-col gap-2 w-fit'>
                    <div className='flex flex-row flex-wrap gap-2 '>
                        {tags.map(tag => (
                            <div
                                className='flex flex-row items-center justify-center w-fit gap-2 border px-2 py-0.5 text-sm rounded-sm'
                                key={tag}
                            >
                                {tag.toUpperCase()}
                                <IoCloseOutline className='hover:cursor-pointer' onClick={() => {
                                    const removedTags = tags.filter(t => t !== tag)
                                    setTags(removedTags)
                                }} size={'14px'} />
                            </div>
                        ))}
                    </div>
                    <input
                        className='py-1 border-b border-gray-400 w-full outline-0'
                        type="text"
                        placeholder='Start typing for suggestions'
                        onFocus={() => { setTagsFieldFocus(true); setTagError('') }}
                        onBlur={() => { setTagsFieldFocus(false) }}
                        onChange={(e) => {
                            setTagQuery(e.target.value)
                        }}
                        value={tagQuery}
                    />
                    <TagSearchSuggestions query={tagQuery} sTags={tags} setQuery={setTagQuery} setTags={setTags} tags={blogTags} isLoading={isTagsLoading} />
                </div>
            </div>
        </div>
    )
}

export default BlogEditor