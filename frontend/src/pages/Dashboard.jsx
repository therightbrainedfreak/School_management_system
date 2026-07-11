import { useAuth } from "../context/AuthContext"
import SuperUserDashboard from './dashboards/SuperUserDashboard'
import AdminDashboard from "./dashboards/AdminDashboard";

function Dashboard() {
    const { user, login, logout } = useAuth();
    if (user.role === 'superuser') return <SuperUserDashboard/>
    if (user.role === 'admin') return <AdminDashboard/>
    return (
        "cannot recognize user"
    )
}

export default Dashboard