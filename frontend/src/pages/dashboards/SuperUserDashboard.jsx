import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";

import React, { useState } from "react";
import Popup from "./dashboard_components/Popup";

function SuperUserDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const logoutUser = async () => {
        try {
            const req = await fetch('/api/v1/auth/logout', { method: "POST" })
            const response = await req.json()
            if (!response.success) {
                null
            } else {
                logout()
                navigate('/', { replace: true })
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div className="">
                <h1>{'Welcome back, ' + user.name}</h1>
                <button onClick={() => { logoutUser() }} className="px-3 py-2 border mr-2">Logout</button>
                <button className="px-3 py-2 border">Logout All</button>
            </div>

            <div style={{ padding: '20px' }}>
                <h2>App Settings</h2>

                <button onClick={() => setIsTermsOpen(true)}>View Terms</button>
                <button onClick={() => setIsAlertOpen(true)}>Delete Account</button>

                {/* Instance 1: Terms Popup */}
                <Popup
                    isOpen={isTermsOpen}
                    onClose={() => setIsTermsOpen(false)}
                    title="Terms of Service"
                >
                    <p>Your data is processed locally. We value privacy.</p>
                    <button onClick={() => setIsTermsOpen(false)}>I Agree</button>
                </Popup>

                {/* Instance 2: Danger Alert Popup */}
                <Popup
                    isOpen={isAlertOpen}
                    onClose={() => setIsAlertOpen(false)}
                    title="Warning"
                >
                    <p style={{ color: 'red' }}>This action is permanent.</p>
                    <button onClick={() => setIsAlertOpen(false)}>Cancel</button>
                </Popup>
            </div>
        </div>
    )
}

export default SuperUserDashboard