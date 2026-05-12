import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        verifySession(controller.signal);
        return () => controller.abort();
    }, [])

    const verifySession = async (signal) => {
        const url = `/api/v1/me`;

        setLoading(true);

        try {
            const request = await fetch(url, { signal, credentials: 'include' });
            if (signal.aborted) return;
            const response = await request.json();

            if (response.success) {
                const userData = response.data.user;
                const userObject = {
                    userId: userData.userId,
                    role: userData.userType,
                    name: userData.username
                }
                setUser(userObject);
            } else {
                setUser(null);
                console.warn("Not logged In");
            }

        } catch (error) {
            if (error.name === 'AbortError') return;
            console.error('Fetch error', error);
            setUser(null);

        } finally {
            if (!signal.aborted) {   // ← only set loading false if NOT aborted
                setLoading(false);
            }
        };
    }

    const login = (userData) => {
        setUser(userData);
    }

    const logout = () => {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
    return context;
}