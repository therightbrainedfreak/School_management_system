import { useState, useEffect } from 'react'
import DashboardButton from './DashBoardButton'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom'
import { BiMenu, BiX, BiSolidDashboard } from "react-icons/bi"
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext';
import { TbMenuDeep } from "react-icons/tb";
import { useTheme } from "../hooks/useTheme"
import { VscColorMode } from "react-icons/vsc";
import { MdLightMode, MdDarkMode } from "react-icons/md";


function Navbar() {
    const [isOpen, alterMenuState] = useState(false)
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();
    const { dark, toggle } = useTheme();

    const linkStyles = "hover:text-primary-300 font-bold hover:underline text-copy transition duration-180 ease-in-out cursor-pointer"

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
            <nav className="border-b-2 border-dashed bg-surface z-10 text-copy landing-navbar flex flex-row items-center max-sm:px-4 py-2 max-md:px-4 px-8 sticky top-0">
                <div className="logo font-bold text-copy text-[22px] select-none mr-auto">This&That School</div>
                <div className='hidden max-md:flex' onClick={() => {
                    alterMenuState(!isOpen)
                }}>
                    {!isOpen ? <TbMenuDeep size={"30px"} /> : "" }
                </div>
                <div className='max-md:hidden'>
                    <ul className='flex gap-3'>
                        <li className={linkStyles}>Utilities</li>
                        <li className={linkStyles}>Notices</li>
                        <li className={linkStyles}>Complaints</li>
                        <li className={linkStyles}>About Us</li>
                    </ul>
                </div>
                <DashboardButton />
                <div className='menu-theme-button flex max-md:hidden border w-fit p-2 rounded-full ml-2' onClick={toggle}>
                    {dark ? <MdDarkMode size={"22px"} /> : <MdLightMode size={"22px"} />}
                </div>
            </nav>

            <div className={`menu z-10 scroll-none fixed bg-gray-400/60 top-0 right-0 h-full w-full ${isOpen ? "flex items-center justify-end" : "hidden"}`} onClick={() => { alterMenuState(!isOpen) }}>
                <AnimatePresence>
                    <motion.ul
                        className='bg-surface text-copy w-80 h-full px-14 py-12 flex flex-col gap-2 rounded-tl-3xl rounded-bl-3xl  relative'
                        initial={{ x: "-100vw" }}
                        animate={{ x: isOpen ? 0 : "100vw" }}
                        exit={{ x: "-100vw" }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >

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
                        <div className='menu-theme-button hidden max-md:flex mt-auto border w-fit px-2 py-2 pr-3 rounded-md' onClick={toggle}>
                            { dark ? <MdDarkMode size={"24px"} /> : <MdLightMode size={"24px"}/> }
                            <div className='font-bold ml-2'>Theme</div>
                        </div>
                    </motion.ul>
                </AnimatePresence>
            </div>
        </>
    )
}

export default Navbar