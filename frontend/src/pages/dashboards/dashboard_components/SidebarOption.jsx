import { NavLink } from "react-router-dom";

function SidebarOption({ label, icon, path }) {

    return (
        <NavLink
            key={path}
            to={path}
            end={path === "/dashboard"}
            className={({ isActive }) =>
                `flex flex-row items-center justify-start py-2 px-4 gap-2 hover:bg-primary-200 hover:border-r-2 border-primary-600 transition-colors duration-150 cursor-pointer ${isActive ? "bg-primary-200 border-r-2 border-primary-600" : ""
                }`
            } >
            <div>
                {icon}
            </div>
            <div>
                {label}
            </div>
        </NavLink>
    )
}

export default SidebarOption;