import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(false);

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
            if (error.name === 'AbortError') {
                console.error('Fetch cancelled on component unmount')
            } else {
                console.error('Fetch error', error)
            }

        } finally {
            setLoading(false)
        };
    }

    const login = ( userData ) => {
        setUser(userData);
    }

    const logout = () => {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
    return context;
}