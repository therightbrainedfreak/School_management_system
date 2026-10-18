import { MdOutlineSupervisedUserCircle, MdOutlineSpaceDashboard, MdErrorOutline } from "react-icons/md";
import { MdOutlineFeaturedVideo  } from "react-icons/md";
import { LuLogs } from "react-icons/lu";

const navConfig = [
    {
        id: 0,
        label: "Dashboard",
        path: "/dashboard",
        icon: MdOutlineSpaceDashboard,
        roles: ["superuser", "backoffice", "teacher", "admin", "student", "parent"],
        module: "dashboard_home"
    },
    {
        id: 1,
        label: "Supervise Users",
        path: "supervise-users",
        icon: MdOutlineSupervisedUserCircle,
        roles: ["superuser"],
        module: "users_supervisor"
    },
    {
        id: 2,
        label: "Logs",
        path: "logs",
        icon: LuLogs,
        roles: ["superuser"],
        module: "logs"
    },
    {
        id: 3,
        label: "Manage Features",
        path: "features",
        icon: MdOutlineFeaturedVideo,
        roles: ["superuser"],
        module: "manage_feature_flags"
    }
];

export default navConfig;