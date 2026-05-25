import { useAuth } from "../../context/AuthContext"

function SuperUserDashboard() {
    const {user, logout} = useAuth();

    const logout = async () => {
         
    }
    return (
        <div className="mx-4">
            <h1>{'Welcome back, ' + user.name}</h1>
            <button className="px-3 py-2 border mr-2">Logout</button>
            <button className="px-3 py-2 border">Logout All</button>
        </div>
    )
}

export default SuperUserDashboard