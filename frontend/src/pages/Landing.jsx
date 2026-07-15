// src/pages/Landing.jsx
import SEO from '../components/SEO'

import { useNavigate } from 'react-router-dom';

import { TbMoodKid } from "react-icons/tb";
import { SiLiteral } from "react-icons/si";
import { PiExamBold } from "react-icons/pi";
import { FaBookBookmark } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";

function Landing() {

  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Landing"
        description="Welcome to This&That School, a vibrant community where every child belongs. We believe in nurturing the whole student—balancing top-tier academics with arts, athletics, and social-emotional development. Join our family and watch your child thrive."
        canonical="https://yourdomain.com/"
        og={{
          image: 'https://yourdomain.com/og-cover.jpg',
        }}
      />

      <main>
        <header className='section-1 max-sm:mx-4 max-sm:mt-8 my-8 mx-8 flex flex-col gap-4'>
          <h1 className='max-sm:text-2xl max-sm:text-center text-6xl'>Putting your <strong className='libertinus-key'>child's</strong> future in great motion</h1>
          <p className='max-sm:text-[16px] max-sm:text-center text-4xl'>We just don't give our students only lectures but real life experiences. Learn smartly with us. We teach 'One Smart Lesson' at a time!</p>
        </header>

        <div className="actions flex max-sm:items-center max-sm:justify-center justify-start max-sm:mx-4 max-sm:my-6 mx-8 gap-4">
          <button className='font-bold border-2 p-2 w-34 flex items-center justify-center gap-2 rounded-sm' onClick={()=>{navigate('/learn-more')}}>
            Learn more
            <FaArrowRight size={"12px"}/>
          </button>
          <button className='font-bold border-2 p-2 w-34 flex items-center justify-center gap-2 rounded-sm' onClick={()=>{navigate('/blogs')}}>
            Blogs
            <FaArrowRight size={"12px"}/>
          </button>
        </div>

        <div className='decorative-banner-1 mx-8 my-8 max-sm:py-6 py-18 max-sm:mx-4 max-sm:my-8 flex max-sm:flex-col flex-row items-center justify-center bg-mauve-800 rounded-lg gap-6'>
          <h1 className='border-2 border-dashed border-white text-white w-fit px-4 py-2 '>12k+ Happy Students</h1>
          <div className='metrics flex flex-row'>
            <div className='metric-item flex flex-col items-center justify-center m-4'>
              <span className='text-[#fcbd34] text-4xl'>40+</span>
              <p className='text-white md:text-2xl'>Instructors</p>
            </div>
            {/* <div className='decorative-line border-l-2 border-white h-26'></div> */}
            <div className='metric-item flex flex-col items-center justify-center m-4'>
              <span className='text-[#fcbd34] text-4xl'>20+</span>
              <p className='text-white md:text-2xl'>Years</p>
            </div>
            {/* <div className='decorative-line border-l-2 border-white h-26'></div> */}
            <div className='metric-item flex flex-col items-center justify-center m-4'>
              <span className='text-[#fcbd34] text-4xl'>99+</span>
              <p className='text-white md:text-2xl'>Others</p>
            </div>
          </div>
        </div>

        <section aria-label="Features" className='max-sm:mx-4 max-sm:my-6 grid grid-cols-2 grid-rows-2 gap-4'>

          <div className='section-tile shadow-white bg-blue-200 p-4 rounded-2xl flex flex-col gap-2'>
            <span className='emblem'>
              <TbMoodKid size={"60px"}/>
            </span>
            <h1 className='text-bold text-[20px]'>Pre-Primary</h1>
            <p className='text-[14px]'>Prepares children for primary school.</p>
          </div>

          <div className='section-tile shadow-white bg-green-200 p-4 rounded-2xl flex flex-col gap-2'>
            <span className='emblem'>
              <SiLiteral size={"56px"}/>
            </span>
            <h1 className='text-bold text-[20px]'>Primary</h1>
            <p className='text-[14px]'>Focus on foundational literacy.</p>
          </div>

          <div className='section-tile shadow-white bg-red-200 p-4 rounded-2xl flex flex-col gap-2'>
            <span className='emblem'>
              <FaBookBookmark size={"52px"}/>
            </span>
            <h1 className='text-bold text-[20px]'>Middle</h1>
            <p className='text-[14px]'>Introduction to subject-specific learning.</p>
          </div>

          <div className='section-tile shadow-white bg-yellow-200 p-4 rounded-2xl flex flex-col gap-2'>
            <span className='emblem'>
              <PiExamBold size={"60px"}/>
            </span>
            <h1 className='text-bold text-[20px]'>Secondary</h1>
            <p className='text-[14px]'>focusing on advanced learning and Board examinations.</p>
          </div>

        </section>

      </main>
    </>
  )
}

export default Landing