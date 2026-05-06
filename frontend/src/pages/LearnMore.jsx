import { useNavigate } from "react-router-dom"

function LearnMore() {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col w-full items-center justify-center gap-8 my-18">
            <img className="w-60" src="/empty.svg" alt="empty page image" />
            <div className="flex flex-col items-center gap-2">
                <div className="text-2xl text-gray-500">Nothing's Here</div>
                <button className="text-md text-gray-100 bg-gray-500 px-6 py-2 rounded-md" onClick={()=>{navigate('/')}}>HOME</button>
            </div>
        </div>
    )
}

export default LearnMore