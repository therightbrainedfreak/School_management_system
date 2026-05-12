import { ThreeDots } from 'react-loader-spinner';
import { motion } from 'framer-motion';

const SearchLoader = () => {
    return (
        <div className="l-wrapper">
            <ThreeDots
                visible={true}
                height="20"
                width="28"
                color="#000000"
                radius="9"
                ariaLabel="three-dots-loading"
            />
        </div>
    )
}

function CategorySearchSuggestions(props) {
    const suggestions = props.categories.filter(cat => cat.label.toLowerCase().includes(props.query.toLowerCase()))
    if (props.query) {
        return (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.2}}
                className='bg-gray-100 rounded-br-md rounded-bl-md p-0.5 text-sm absolute top-full w-full flex flex-col gap-0.5 max-h-40 overflow-y-auto    '
            >
                {props.isLoading 
                    ? <SearchLoader/>
                    : suggestions.map(sug => (
                        <div
                        onClick={()=>{props.setCategory(sug.label); props.setQuery('')}}
                            className='px-1 rounded-sm bg-gray-200 hover:bg-gray-900 hover:text-white cursor-pointer' key={sug.id}>
                            {sug.label}
                        </div>
                    ))
                }
            </motion.div>
        )
    }
}

export default CategorySearchSuggestions