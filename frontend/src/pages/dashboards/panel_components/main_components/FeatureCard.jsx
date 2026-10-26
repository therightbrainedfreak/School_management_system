import { NavLink } from "react-router-dom";
import { MdArrowRight } from "react-icons/md";

function FeatureCard({ flag }) {
    return (
        <div className="w-fit hover:shadow-el-2 hover:cursor-pointer rounded-md">
            <NavLink
                to={flag.path + "?" + new URLSearchParams({
                    action: "create",
                    featureId: flag.flagId
                })}>
                <div className="flag-card border gap-1 border-gray-300 rounded-md p-6 w-fit min-w-70 max-w-80 flex flex-col relative">
                    <span className="font-bold text-2xl text-primary-500">{flag.label}</span>
                    <p className="text-sm">{flag.description}</p>
                    <p className="text-sm border-t border-gray-300 py-1 mt-2 flex items-center">Open</p>
                </div>
            </NavLink>
        </div>
    )
}

export default FeatureCard;