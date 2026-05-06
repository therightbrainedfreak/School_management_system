import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaSquareThreads } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Footer() {
    const navigate = useNavigate();
    return (
        <footer className='border-t mx-4 py-2 flex flex-row items-center justify-center'>
            <section className='max-sm:w-50 text-center flex flex-col items-center'>
                <h1 className='text-[18px] whitespace-nowrap'>This&That School &reg;</h1>
                <p className='text-[12px] text-start whitespace-nowrap'>&copy; Copyright 2026, All rights reserved.</p>
                <div className='media-link flex flex-row py-2 gap-2'>
                    <FaFacebook />
                    <FaInstagram />
                    <FaLinkedin />
                    <FaSquareThreads />
                </div>
            </section>
        </footer>
    )
}

export default Footer