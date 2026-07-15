import { useState, useEffect } from 'react'
import DashboardButton from './DashBoardButton'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom'
import { BiMenu, BiX, BiSolidDashboard } from "react-icons/bi"
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext';


function Navbar() {
    const [isOpen, alterMenuState] = useState(false)
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const linkStyles = "text-gray-500 hover:text-gray-900 hover:underline transition duration-180 ease-in-out cursor-pointer"

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }

        return () => document.body.classList.remove('overflow-hidden')
    }, [isOpen])

    return (
        <>
            <nav className='landing-navbar flex flex-row items-center max-sm:mx-4 max-sm:py-2 mx-8 py-2 border-b border-gray-950'>
                <div className="logo font-bold text-neutral-900 text-[22px] select-none mr-auto">This&That School</div>
                <DashboardButton />
                <div className='hidden max-md:flex' onClick={() => {
                    alterMenuState(!isOpen)
                }}>
                    {!isOpen ? <BiMenu size={"36px"} /> : <BiX size={"36px"} />}
                </div>
                <div>
                    <ul className='max-md:hidden flex gap-3'>
                        <li className={linkStyles} onClick={()=>{
                            navigate('/auth?action=login')
                        }}>{user ? "" : "Login"}</li>
                        <li className={linkStyles}>Utilities</li>
                        <li className={linkStyles}>Notices</li>
                        <li className={linkStyles}>Complaints</li>
                        <li className={linkStyles}>About Us</li>
                    </ul>
                </div>
            </nav>

            <div className={`menu z-10 scroll-none absolute bg-gray-400/60 top-0 right-0 h-full w-full ${isOpen ? "flex items-center justify-end" : "hidden"}`} onClick={() => { alterMenuState(!isOpen) }}>
                <AnimatePresence>
                    <motion.ul
                        className='bg-gray-950 text-white w-80 h-full px-14 py-12 flex flex-col gap-2 rounded-tl-3xl rounded-bl-3xl  relative'
                        initial={{ x: "-100vw" }}
                        animate={{ x: isOpen ? 0 : "100vw" }}
                        exit={{ x: "-100vw" }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <li className='menu-link' onClick={() => {
                            navigate('/auth?action=login')
                            alterMenuState(!isOpen)
                        }}
                        >
                            Login
                        </li>

                        <li className='menu-link'>Utilities</li>

                        <li className='menu-link'>Notice Board</li>

                        <li className='menu-link'>Complaint Box</li>

                        <li className='menu-link'>About Us</li>

                        <li className='menu-link' onClick={() => {
                            navigate('/code-of-conduct')
                            alterMenuState(!isOpen)
                        }}>Code of Conduct</li>

                        <li className='menu-link' onClick={() => {
                            navigate('/help-center')
                            alterMenuState(!isOpen)
                        }}>Help Center</li>

                        <span className='absolute right-4 top-4'>
                            <IoIosCloseCircleOutline size={"26px"} onClick={() => {
                                alterMenuState(!isOpen)
                            }} />
                        </span>
                    </motion.ul>
                </AnimatePresence>
            </div>

        </>
    )
}

export default Navbar