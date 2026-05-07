import { useState, useEffect } from 'react'
import DashboardButton from './DashBoardButton'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom'
import { BiMenu, BiX, BiSolidDashboard } from "react-icons/bi"
import { motion, } from 'framer-motion'


function Navbar() {
    const [isOpen, alterMenuState] = useState(false)
    const navigate = useNavigate();

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
            <nav className='landing-navbar flex max-sm:flex-row max-sm:items-center max-sm:mx-4 max-sm:py-2 border-b border-gray-950'>
                <div className="logo font-bold text-neutral-900 text-[22px] select-none mr-auto">This&That School</div>
                <DashboardButton />
                <div className='hidden max-sm:flex' onClick={() => {
                    alterMenuState(!isOpen)
                }}>
                    {!isOpen ? <BiMenu size={"36px"} /> : <BiX size={"36px"} />}
                </div>
            </nav>

            <div className={`menu z-10 scroll-none max-sm:absolute backdrop-blur-[2px] bg-gray-200/80 top-0 right-0 h-full w-full ${isOpen ? "flex items-center justify-end" : "hidden"}`} onClick={()=>{alterMenuState(!isOpen)}}>
                <motion.ul
                    className='bg-gray-950 text-white w-80 h-full px-14 py-12 flex flex-col gap-2 rounded-tl-3xl rounded-bl-3xl  relative'
                    initial={{ x: "-100vw" }}
                    animate={{ x: isOpen ? 0 : 200 }}
                    transition={{ type: "spring", bounceDamping: 10, duration: 0.1, ease: "easeIn" }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <li className='menu-link' onClick={() => {
                        navigate('/login')
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
            </div>
        </>
    )
}

export default Navbar