import { MdDownloading } from "react-icons/md"
import { BiSolidDashboard } from 'react-icons/bi'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function DashboardButton() {
    const navigate = useNavigate()
    const { user, loading } = useAuth();

    return (
        <div className="max-sm:mr-3 cursor-pointer">
            {loading ? user ? <BiSolidDashboard onClick={()=>{navigate(`/Dashboard`)}} size={"26px"}/> : "" : <MdDownloading size={"26px"}/>}
        </div>
    )
}

export default DashboardButton