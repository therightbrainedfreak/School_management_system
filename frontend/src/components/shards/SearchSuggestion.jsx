import { AnimatePresence, motion } from "framer-motion";
import { ThreeDots } from "react-loader-spinner";
import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";

function SearchSuggestions(props) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const debouncedQuery = useDebounce(props.query, 500);

    useEffect(() => {
        if (!debouncedQuery) {
            setResults([])
            return
        };
        if (props.query.length < 3) return;

        const controller = new AbortController();

        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/v1/blogs/bss?q=${debouncedQuery}`, {
                    signal: controller.signal,
                });
                const data = await res.json();
                if (!res.ok) {
                    console.error("Error getting suggestions")
                } else {
                    setResults(data.data.suggestions);
                }
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
                />
            </div>
        )
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                exit={{ y: 20, opacity: 0 }}
                className="suggestions absolute top-full bg-gray-200 mt-2 rounded-tr-md rounded-br-md rounded-bl-md p-2 h-fit min-w-40 flex flex-col items-start justify-start gap-2 text-sm max-h-60 overflow-y-auto">

                <span
                    className="heading w-full h-fit" >
                    {props.query ? props.query.length < 3 ? `Type ${3 - props.query.length} more character to search` : "" : "Type atleast 3 characters to start search"}
                </span>

                <span className="flex flex-col gap-2" >
                    {results.length == 0
                        ? props.query.length >= 3
                            ? loading
                                ? <SearchLoader />
                                : <div className="font-bold">{`Search for "${props.query}"`}</div>
                            : null
                        : results.map(item => {
                            return <div
                                className="cursor-pointer hover:bg-gray-900 hover:text-white bg-gray-300 px-1.5 py-1 rounded-sm leading-none" key={item.slice(0, 10)}>
                                {item}
                            </div>
                        })
                    }
                </span>
            </motion.div>
        </AnimatePresence>
    )
}

export default SearchSuggestions;