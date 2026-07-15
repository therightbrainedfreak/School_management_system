import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

const AuthContext = createContext(null);

async function fetchCurrentUser() {
    const res = await fetch('/api/v1/me', { credentials: 'include' });
    if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error('Unknow error');
    }
    const finalResponse = await res.json();
    const userData = finalResponse.data.user;
    return {
        userId: userData.userId,
        role: userData.userType,
        name: userData.username
    }
}

async function loginRequest(credentials) {
    const res = await fetch('/api/v1/auth/login', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(credentials)
    })
    if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        throw new Error(err.error.message || "Unknow Error")
    }
    const finalResponse = await res.json();
    const userData = finalResponse.data.user;
    return {
        userId: userData.id,
        role: userData.role,
        name: userData.name
    };
}

async function logoutRequest() {
    const res = await fetch('/api/v1/auth/logout', {
        method: "POST",
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error('Logout Failed');
    }
}

export function AuthProvider({ children }) {
    const queryClient = useQueryClient();

    const {
        data: user,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: fetchCurrentUser,
        staleTime: 5 * 60 * 1000,
        retry: false,
    })

    const loginMutation = useMutation({
        mutationFn: loginRequest,
        onSuccess: (user) => {
            queryClient.setQueryData(['auth', 'me', 'user'], user);
        },
    })
    
    const logoutMutation = useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            queryClient.setQueryData(['auth', 'me', 'user'], null);
            queryClient.clear();
        }
    })

    const value = {
        user,
        isLoading,
        error,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
        loginError: loginMutation.error,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
    return context;
}