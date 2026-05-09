import { AnimatePresence, motion } from "framer-motion";
import { ThreeDots } from "react-loader-spinner";
import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";

function SearchSuggestions(props) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const debouncedQuery = useDebounce(props.query, 800);

    useEffect(() => {
        if (!debouncedQuery) return;
        if (debouncedQuery.length.trim < 3) return;

        const controller = new AbortController();

        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/v1/blogs/search?q=${debouncedQuery}`, {
                    signal: controller.signal,
                });
                const data = await res.json();
                setResults(data);
            } catch (err) {
                if (err.name !== "AbortError") console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
        return () => controller.abort(); // cancel previous request
    }, [debouncedQuery]);

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
                    wrapperStyle={{}}
                    wrapperClass="l-wrapper" />
            </div>
        )
    }

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ y: 20, opacity: 0 }}
            className="suggestions absolute top-full bg-gray-200 mt-2 rounded-tr-md rounded-br-md rounded-bl-md p-2 h-fit min-w-40 flex flex-col items-start justify-start text-sm">
            <span className="heading w-full">
                {props.query ? props.query.length > 3 ? loading ? <SearchLoader/> : "Waiting" : "Type some more" : "Type something"}
            </span>
            <span
                className={`${!results ? "hidden" : "flex"} flex-col`}
            >
                {!results ? "empty" : results.map(item => {
                   return <span className="border-b border-gray-400 cursor-pointer hover:bg-gray-300" key={item.id}>{item.name}</span>
                })}
            </span>
        </motion.div>
    )
}

export default SearchSuggestions;