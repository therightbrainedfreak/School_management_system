import Sidebar from "./dashboard_components/Sidebar"
import { useAuth } from "../../context/AuthContext"
import { Suspense } from "react";

import { Outlet } from "react-router-dom";
import ContentLoader from "./dashboard_components/ContentLoader";

function DashboardLayout() {

    return (
        <div className="flex flex-row h-screen w-full overflow-hidden">
            <Sidebar />
            <div className="flex flex-col w-full">
                <div className="h-14 border-b-2 border-gray-300 p-4 text-xl text-bold">
                    Topbar area left for further developement
                </div>
                <Suspense fallback={<ContentLoader />}>
                    <Outlet />
                </Suspense>
            </div>
        </div>
    )
}

export default DashboardLayout