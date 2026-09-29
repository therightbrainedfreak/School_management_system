import { MdDownloading } from "react-icons/md"
import { BiSolidDashboard, BiLogIn } from 'react-icons/bi'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

function DashboardButton() {
    const navigate = useNavigate()
    const { user, isLoading } = useAuth();

    return (
        <div>
            <div className="ml-1 md:hidden">
                {
                    isLoading
                        ? <MdDownloading size={"26px"} />
                        : user
                            ? <BiSolidDashboard onClick={() => { navigate(`/dashboard`) }} size={"26px"} />
                            : <BiLogIn onClick={() => { navigate('/auth?action=login') }} size={"28px"} />
                }
            </div>
            <div className="ml-3 max-md:hidden flex">
                {
                    isLoading
                    ? <div className="bg-primary-400 hover:bg-primary-hover flex flex-row items-center justify-center pl-4 pr-3.5 py-1.5 rounded-full text-primary-soft font-bold gap-1 transition-colors duration-175 ease-in-out cursor-pointer">Verifying <MdDownloading size={"26px"} /></div>
                    : user
                    ? <div onClick={() => { navigate(`/dashboard`) }} className="bg-primary-400 hover:bg-primary-hover flex flex-row items-center justify-center pl-4 pr-3.5 py-1.5 rounded-full text-primary-soft font-bold gap-1 transition-colors duration-175 ease-in-out cursor-pointer">Dashboard <BiSolidDashboard size={"26px"} /></div>
                    : <div onClick={() => { navigate('/auth?action=login') }} className="bg-primary-400 hover:bg-primary-hover flex flex-row items-center justify-center pl-4 pr-3.5 py-1.5 rounded-full text-primary-soft font-bold gap-1 transition-colors duration-175 ease-in-out cursor-pointer">Login <BiLogIn size={"24px"} /></div>
                }
            </div>
        </div>
    )
}

export default DashboardButton