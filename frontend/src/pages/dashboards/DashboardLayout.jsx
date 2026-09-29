import Sidebar from "./dashboard_components/Sidebar"
import { useAuth } from "../../context/AuthContext"

import { Outlet } from "react-router-dom";

function DashboardLayout(props) {
    const { user } = useAuth();

    return (
        <div className="flex flex-row h-screen w-full">
            <Sidebar />
            <div className="flex flex-col w-full">
                <div className="h-14 border-b-2 border-gray-300 p-4 text-xl text-bold">
                    Topbar area left for further developement
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout