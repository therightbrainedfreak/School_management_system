import { MdDownloading } from "react-icons/md"
import { BiSolidDashboard } from 'react-icons/bi'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

function DashboardButton() {
    const navigate = useNavigate()
    const { user, isLoading } = useAuth();

    return (
        <div className="max-sm:mr-3 cursor-pointer">
            {isLoading ? <MdDownloading size={"26px"}/> : user ? <BiSolidDashboard onClick={()=>{navigate(`/dashboard`)}} size={"26px"}/> : ""}
        </div>
    )
}

export default DashboardButton