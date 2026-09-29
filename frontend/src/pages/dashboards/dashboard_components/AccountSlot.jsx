import { useAuth } from "../../../context/AuthContext";

import { VscSignOut } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";

import { PulseLoader } from "react-spinners";

function AccountSlot() {
    const { user, logout, isLoggingOut } = useAuth();

    const logoutUser = () => {
        if (isLoggingOut) return
        logout();
    }

    return (
        <div className="p-2 m-2 border-t border-gray-400 flex flex-col">
            <div className="flex items-center justify-start gap-2">
                <div className="avatar h-8 w-8 bg-primary-200 border border-primary-600 rounded-full"></div>
                <div>
                    <h1 className="text-l font-bold">{user.name}</h1>
                    <p className="text-sm -mt-1">{user.role}</p>
                </div>
            </div>
            <div className="flex gap-2 mt-3">
                <button className="border rounded-md w-full p-1 flex items-center justify-center border-muave-600 hover:cursor-pointer hover:bg-gray-200 transition-colors"><CiSettings size={"24px"} /></button>
                <button className="border rounded-md w-full p-1 flex items-center justify-center hover:cursor-pointer hover:bg-red-200 transition-colors text-red-400"
                    onClick={() => logoutUser()}>
                    {
                        isLoggingOut
                            ? <PulseLoader size={"6px"} color="#ff6467" />
                            : <VscSignOut size={"20px"} />
                    }
                </button>
            </div>
        </div>
    )
};

export default AccountSlot;