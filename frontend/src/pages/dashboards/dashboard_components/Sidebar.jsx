import AccountSlot from "./AccountSlot";
import SidebarOption from "./SidebarOption";
import { useAuth } from "../../../context/AuthContext";

import navConfig from "../../../configurations/navConfig.js";

function Sidebar() {
    const { user } = useAuth();

    const visibleItems = navConfig.filter(item => item.roles.includes(user.role));

    return (
        <div className="flex flex-col max-sm:hidden align-start h-full border-r-2 border-gray-300">
            {/* Logo area */}
            <div className="flex items-center justify-center gap-2 p-4 h-fit">
                <div className="h-10 w-10 border-red-600 rounded-md bg-red-300 text-[10px] flex items-center justify-center">10X10</div>
                <div className="flex flex-col items-start justify-center">
                    <span className="text-2xl font-bold">This&That</span>
                    <span className="text-[12px] text-primary-600 -mt-1">Institution</span>
                </div>
            </div>
            <nav>
                {
                    visibleItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <SidebarOption key={item.id} label={item.label} icon={<Icon size={"16px"}/>} path={item.path}/>
                        )
                    })
                }
            </nav>
            <div className="mt-auto">
                <AccountSlot />
            </div>
        </div>
    )
}

export default Sidebar;