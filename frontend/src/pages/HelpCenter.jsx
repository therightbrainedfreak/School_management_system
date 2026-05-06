import { useNavigate } from "react-router-dom"
import { FaArrowRight } from "react-icons/fa";

function HelpCenter() {
    const navigate = useNavigate();
    return (
        <div className="max-sm:mx-4 py-4">
            <h1 className="text-2xl font-bold">Help Center</h1>
            <section className="my-2">
                <h1 className="font-bold">Reach us out</h1>
                <p className="text-sm">Monday to Friday, 10 AM to 4 PM</p>
                <p className="text-sm">Office: Rehmat Nagar, Lane no - 8, Sir Syyed Nagar, Moradabad (244001), India</p>
            </section>
            <section>
                <h1 className="font-bold">Phone - Tel</h1>
                <p className="text-sm">Assistant Manager: +91 12345-12345</p>
                <p className="text-sm">Common Help Desk: +91 12345-12345</p>
            </section>
            <section>
                <h1 className="font-bold">Email</h1>
                <p className="text-sm">Customer Support: support@thisandthat.edu</p>
            </section>
            <section className="my-2 font-bold">
                <h1>Request Callback</h1>
                <p className="font-normal text-sm">Leave your phone number below so we can call you back.</p>
                <form className="flex flex-row gap-2 bg-gray-200 my-2 rounded-md p-2">
                    <input type="number" className="bg-gray-100 w-full px-3 rounded-sm" placeholder="Phone Number"/>
                    <button type="submit" className="flex items-center justify-center text-gray-500 bg-gray-100 rounded-sm p-4">
                        <FaArrowRight/>
                    </button>
                </form>
            </section>
            <section className="mt-2">
                <h1 className="font-bold">Or Navigate to</h1>
                <div className="border-2 w-fit px-4 py-2 my-2 font-bold rounded-md cursor-pointer" onClick={()=>{navigate('/complaint-box')}}>Complaint Box</div>
            </section>
        </div>
    )
}

export default HelpCenter