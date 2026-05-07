import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { ThreeDots } from "react-loader-spinner";
import { FaArrowRight } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function LoginPage() {

    const ROLES = {
        STU: 'STUDENT',
        TEA: 'TEACHER',
        ADM: 'ADMIN',
        PNT: 'PARENT',
        SPU: 'SUPERUSER',
        BCO: 'BACKOFFICE'
    }

    const [user_id, setUser_id] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE');
    const navigate = useNavigate();
    const [inputError, setInputError] = useState('');
    const { user, login, logout } = useAuth();
    const [isLoading, setisLoading] = useState(false);

    useEffect(() => {
        if (user_id.length >= 3) {
            let code = user_id.slice(0, 3).toUpperCase();
            const keys = Object.keys(ROLES)
            if (keys.includes(code)) {
                setRole(ROLES[code])
                setInputError('')
            } else {
                setRole('UNKNOWN')
                setInputError('Invalid UserId')
            }
        }

        return () => {
            setRole('ROLE')
            setInputError('');
        }

    }, [user_id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setisLoading(true)
        try {
            const response = await fetch(`/api/v1/auth/login`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    user_id: user_id,
                    password: password,
                    role: role.toLowerCase()
                })
            })
            const results = await response.json();
            if (results.success) {
                login(results.data.user);
                toast.success("Login Success", {autoClose: 2000});
                await new Promise(resolve => setTimeout(resolve, 2000))
                navigate("/dashboard");
            } else {
                toast.error(results.error.message);
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        } finally {
            setisLoading(false)
        }
    };

    function LoginLoader() {
        return (
            <div className="l-wrapper">
                <ThreeDots
                    visible={true}
                    height="20"
                    width="28"
                    color="#000000"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass="l-wrapper" />
            </div>
        )
    }

    return (
        <div className="max-sm:mx-4 p-8">

        <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            closeButton={false}
            closeOnClick={false}
            pauseOnFocusLoss
            pauseOnHover
            draggable
            draggablePercent={20}
        />

            <form className="login-form border flex flex-col p-8 rounded-2xl" onSubmit={handleSubmit}>

                <h1 className="text-2xl font-bold mb-4 flex flex-row items-center select-none">
                    Log In
                    <span className="ml-auto font-mono text-[10px] border-2 border-green-500 px-1 py-0.5 text-green-500 rounded-sm">
                        {role}
                    </span>
                </h1>

                <AnimatePresence>
                    {inputError && (
                        <motion.span
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="relative text-[12px] text-red-500 z-0"
                        >
                            {inputError}
                        </motion.span>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    <input
                        className={`${inputError ? 'border-b-2 border-red-500 text-red-500' : 'border-b-2'} my-2 outline-0 py-1`}
                        type="text"
                        name="userid"
                        value={user_id}
                        autoCapitalize="characters"
                        autoComplete="username"
                        onChange={(e) => {
                            setUser_id(e.target.value.toUpperCase())
                        }}
                        required
                        placeholder="User ID"
                    />
                </AnimatePresence>

                <AnimatePresence>
                    <input
                        className="border-b-2 my-2 outline-0 py-1"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                    />
                </AnimatePresence>

                <div>
                    <button
                        type="submit"
                        className={`w-full border-2 border-gray-900 font-bold mt-6 p-2 rounded-md bg-blue-300 flex items-center justify-center`}
                        disabled={inputError ? true : isLoading ? true : false}
                    >
                        {isLoading ? <LoginLoader/> : <div className="flex items-center gap-2">Login <FaArrowRight size={"12px"}/></div>}
                    </button>
                </div>

                <p className="text-center mt-4 text-blue-400 underline">Forget credentials</p>

            </form>

        </div>
    )
}

export default LoginPage;