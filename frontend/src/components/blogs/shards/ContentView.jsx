import { useState } from "react"
import { FaArrowDown } from "react-icons/fa";

function ContentView({ htmlContent, title, recordRead }) {
    const [isExpanded, setExpanded] = useState(false);

    return (
        <div className="flex flex-col">

            <h1 className="text-xl text-black">{title}</h1>

            <div className='relative'>

                <div className={`${isExpanded ? "hidden" : "absolute"} inset-0 bg-linear-to-t from-white to-transparent`}></div>

                <div className={`${isExpanded ? "" : "max-h-80 overflow-hidden"}`}>
                    <article className="break-normal leading-6 flex flex-col gap-1" dangerouslySetInnerHTML={{ __html: htmlContent.replace(/&nbsp;/g, ' ') }}></article>
                </div>

                {
                    isExpanded
                        ? null
                        : <button
                            onClick={() => { recordRead(); setExpanded(!isExpanded) }}
                            className={`${isExpanded ? "" : "absolute"} flex items-center justify-center bg-white bottom-4 border rounded-2xl px-3 py-1 text-mg gap-2`}>
                            Continue Reading <FaArrowDown size={"12px"}/>
                        </button>
                }

            </div>
        </div>
    )
}

export default ContentView