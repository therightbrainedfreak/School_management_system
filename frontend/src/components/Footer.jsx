import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaSquareThreads } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Footer() {
    const navigate = useNavigate();
    return (
        <footer className='border-t max-sm:mx-4 max-sm:py-2 mx-8 py-2 flex flex-row items-start justify-between'>
            <section className='max-sm:w-50 flex flex-col items-start'>
                <h1 className='text-[18px] text whitespace-nowrap'>This&That School &reg;</h1>
                <p className='text-[12px] text-start whitespace-nowrap'>&copy; Copyright 2026, All rights reserved.</p>
                <div className='media-link flex flex-row py-2 gap-2'>
                    <FaFacebook />
                    <FaInstagram />
                    <FaLinkedin />
                    <FaSquareThreads />
                </div>
            </section>
            <section className="text-[14px] flex">
                <ul className="text-end">
                    <li className="underline cursor-pointer">Code of Conduct</li>
                    <li className="underline cursor-pointer">Help Center</li>
                    <li className="underline cursor-pointer">Privacy Policy</li>
                </ul>
            </section>
        </footer>
    )
}

export default Footer