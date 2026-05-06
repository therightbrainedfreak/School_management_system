import { MdDownloading } from "react-icons/md"
import { BiSolidDashboard } from 'react-icons/bi'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function DashboardButton() {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
    const [isLoggedIn, setLogin] = useState(false)
    const [data, setData] = useState('')

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        setLoading(true);
        fetch('http://localhost:3300/api/v1/me', {
            signal,
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                setLogin(true);
                setData(data.data);
            } else {
                setLogin(false);
                console.warn("Not Logged In.");
            }
        })
        .catch((err) => {
            if (err.name === 'AbortError') {
                console.error('Fetch cancelled on component unmount')
            } else {
                console.error('Fetch error', err)
            }
        })
        .finally(() => {setLoading(false)})
        return () => {
            controller.abort()
        }
    }, []);

    return (
        <div className="max-sm:mr-3 cursor-pointer">
            {isLoading ? <MdDownloading size={"26px"}/> : isLoggedIn ? <BiSolidDashboard onClick={()=>{navigate(`/Dashboard/${data.role}`)}} size={"26px"}/> : ""}
        </div>
    )
}

export default DashboardButton