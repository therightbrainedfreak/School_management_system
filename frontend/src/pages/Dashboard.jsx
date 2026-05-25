import { useAuth } from "../context/AuthContext"
import SuperUserDashboard from './dashboards/SuperUserDashboard'

function Dashboard() {
    const { user, login, logout } = useAuth();
    if (user.role === 'superuser') return <SuperUserDashboard/>
    return (
        "cannot recognize user"
    )
}

export default Dashboard