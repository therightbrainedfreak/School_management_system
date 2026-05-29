import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";

function SuperUserDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const logoutUser = async () => {
        try {
            const req = await fetch('/api/v1/auth/logout', { method: "POST" })
            const response = await req.json()
            if (!response.success) {
                null
            } else {
                logout()
                navigate('/', {replace: true})
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="mx-4">
            <h1>{'Welcome back, ' + user.name}</h1>
            <button onClick={()=>{logoutUser()}} className="px-3 py-2 border mr-2">Logout</button>
            <button className="px-3 py-2 border">Logout All</button>
        </div>
    )
}

export default SuperUserDashboard