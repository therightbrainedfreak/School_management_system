import { useSearchParams, useNavigate, replace } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { ThreeDots } from "react-loader-spinner";

// Icon imports
import { IoEye, IoEyeOff, IoKeyOutline } from "react-icons/io5";

function AuthLogin() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const { user, login, logout } = useAuth();

    // Url params
    const callbackUrl = searchParams.get("callbackUrl") ?? '/';

    // Roles mapping
    const ROLES = {
        STU: 'STUDENT',
        TEA: 'TEACHER',
        ADM: 'ADMIN',
        PNT: 'PARENT',
        SPU: 'SUPERUSER',
        BCO: 'BACKOFFICE'
    }

    // Form data states
    const [user_id, setUser_id] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [inputError, setInputError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setisLoading] = useState(false);
    const [isPasswordVisible, setPasswordVisibility] = useState(false);

    // Side effects
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

    // Main login handler
    const postLoginRequest = async (e) => {
        e.preventDefault()

        if (inputError) {
            toast.error('Correct the errors first')
            return
        }

        setisLoading(true)

        const controller = new AbortController()

        try {
            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                signal: controller.signal,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ user_id, password, role: role.toLowerCase()}),
            })

            const data = await res.json()

            if (data.success) {
                login(data.data.user);
                toast.success("Login Success", { autoClose: 1000 });
                await new Promise(resolve => setTimeout(resolve, 1100))
                navigate(callbackUrl, {replace: true})
            } else {
                toast.error(data.error.message);
            }

        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Something went wrong. Try again.')
            }
        } finally {
            setisLoading(false)
        }
    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                closeButton={false}
                closeOnClick={false}
                pauseOnFocusLoss
                draggable
                draggablePercent={40}
            />

            <h1 className="text-3xl font-bold flex items-center justify-center gap-2 w-fit mb-10">Login</h1>
            <form onSubmit={postLoginRequest} className="w-full flex flex-col gap-10">
                <div className="input-wrapper flex flex-col gap-2">
                    <div className="flex gap-2">
                        <label className={inputError ? 'text-red-500' : ""} htmlFor="userid-field">User ID</label>
                        <p className="text-red-500 text-sm">{inputError ? "*" + inputError : ""}</p>
                    </div>
                    <input
                        id="userid-field"
                        className={`border ${inputError ? 'border-red-500 text-red-500 outline-red-500' : 'border-gray-300'} px-3 py-2 w-full`}
                        type="text"
                        autoComplete="username"
                        autoCapitalize="characters"
                        name="userid"
                        placeholder="ABC1234567"
                        value={user_id}
                        onChange={(e) => {
                            setUser_id(e.target.value.toUpperCase())
                        }}
                        required
                    />
                    <div className="flex gap-2">
                        <label className={passwordError ? 'text-red-500' : ""} htmlFor="password-field">Password</label>
                        <p className="text-red-500 text-sm">{passwordError ? "*" + passwordError : ""}</p>
                    </div>
                    <div className="password-group flex">
                        <input
                            className={`border ${passwordError ? 'border-red-500 text-red-500 outline-red-500' : 'border-gray-300'} px-3 py-2 w-full`}
                            type={isPasswordVisible ? "text" : "password"}
                            name="password"
                            autoComplete="current-password"
                            id="password-field"
                            placeholder={isPasswordVisible ? "Password" : "••••••••"}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setPasswordError('')
                            }}
                            required
                        />
                        <div
                            onClick={() => { setPasswordVisibility(!isPasswordVisible) }}
                            className="border border-gray-300 flex items-center justify-center px-2.5 cursor-pointer border-l-0">
                            {isPasswordVisible ? <IoEyeOff size={'24px'} /> : <IoEye size={'24px'} />}
                        </div>
                    </div>
                    <span>Forget password? <span onClick={() => { navigate('/auth?action=password-reset') }} className="text-blue-600 underline cursor-pointer select-none">reset now</span></span>
                </div>
                <div className="flex flex-col items-center justify-center gap-6">
                    <button
                        className="flex items-center justify-center loader-parent border border-gray-800 px-3 py-2 w-full bg-blue-500 cursor-pointer"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <ThreeDots width={'40px'} height={'24px'} wrapperClass="loader-parent" color="#ffffff"/> : <span className="text-white font-bold">Login</span>} 
                    </button>
                    <div className="flex items-center gap-2 w-60">
                        <div className="flex-1 border-t border-grey-100" />
                        <span className="text-md leading-0 text-grey-200">or</span>
                        <div className="flex-1 border-t border-grey-100" />
                    </div>
                    <button type="button" onClick={() => { navigate('/auth?action=passkey') }} className="border border-gray-900 px-3 py-2 w-full flex items-center justify-center gap-2 cursor-pointer">Use Passkey <IoKeyOutline size={'20px'} /> </button>
                </div>
            </form>
        </>
    )
}

export default AuthLogin