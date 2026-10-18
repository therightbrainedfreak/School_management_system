import { NavLink } from "react-router-dom";

function FeatureCard({ flag }) {
    return (
        <NavLink
            to={"addfeature"}>
            <div className="flag-card border border-gray-300 rounded-md px-3 py-2 w-fit min-w-46 hover:shadow-el-2 hover:cursor-pointer flex flex-col relative">
                <span className="font-bold text-lg text-gray-600">{flag.label}</span>
                <span className="text-sm">FlagId: {flag.flagId}</span>
                <span className="text-sm">Key: {flag.key}</span>
                <span className="text-sm">Module: {flag.module}</span>
                <span className="absolute border rounded-md p-2 text-[12px] font-bold bottom-2 right-2 bg-white">GO</span>
            </div>
        </NavLink>
    )
}

export default FeatureCard;