// Login v2 responsive, supports redirects
import { useSearchParams, useNavigate, replace } from "react-router-dom"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slideVariants, slideTransition } from "../hooks/useSlideTransition"
import SEO from '../components/SEO'

// Component imports
import AuthLogin from "../components/auth/AuthLogin";

function RenderAuthComp({ action, navigate }) {
    if (action === 'passkey') return <div onClick={() => { navigate('/auth?action=login', { replace: true }) }}>Coming soon.....</div>
    if (action === 'password-reset') return <div onClick={() => { navigate('/auth?action=login', { replace: true }) }}>Coming soon.....</div>
    return (
        <AuthLogin />
    )
}

function AuthWrapper() {
    const navigate = useNavigate();

    // Init useSearchParams
    const [searchParams, setSearchParams] = useSearchParams();

    // get parameters
    const action = searchParams.get("action") || "login";
    const loginType = searchParams.get("type") || "credentials";

    const [direction, setDirection] = useState('right')

    return (
        <>
            <SEO
                title="Auth"
                description="Login page to This&That School."
                canonical="https://yourdomain.com/auth?action=login"
                og={{
                    image: 'https://yourdomain.com/og-cover.jpg',
                }}
            />
            <div className="main-wrapper h-screen w-full flex items-center justify-center bg-gray-100 font-sans">
                <div className="child-wrapper lg:h-140 lg:w-240 lg:grid lg:grid-cols-[6fr_4fr] max-sm:w-screen max-sm:h-screen md:min-w-100 md:min-h-120 bg-white rounded-2xl shadow-md shadow-gray-400 overflow-hidden">
                    <div className={`hero-wrapper bg-[url('/leaves.jpg')] bg-center bg-cover lg:flex lg:items-start lg:justify-start hidden p-10`}>
                    </div>
                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={action}
                                custom={direction}
                                variants={slideVariants}
                                initial={direction === 'right' ? 'enterFromRight' : 'enterFromLeft'}
                                animate="center"
                                exit={direction === 'right' ? 'exitToLeft' : 'exitToRight'}
                                transition={slideTransition}
                                className="dynamic-wrapper flex flex-col items-start justify-start p-10">
                                <RenderAuthComp action={action.toLowerCase()} navigate={navigate} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuthWrapper