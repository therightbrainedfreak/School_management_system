// src/pages/Landing.jsx
import SEO from '../components/SEO'

import { useNavigate } from 'react-router-dom';
import { useTheme } from "../hooks/useTheme"

import { TbMoodKid } from "react-icons/tb";
import { SiLiteral } from "react-icons/si";
import { PiExamBold } from "react-icons/pi";
import { FaBookBookmark } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";

function Landing() {

  const navigate = useNavigate();
  const { dark, toggle } = useTheme();

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

      <main className='text-copy'>
        <header className='section-1 max-sm:mx-4 max-sm:mt-8 my-8 mx-8 flex flex-col gap-4'>
          <h1 className='max-sm:text-3xl text-center text-6xl max-sm:leading-10 leading-18'>Putting your <strong className='libertinus-key'>child's</strong> future in great motion</h1>
          <p className='max-sm:text-[20px] text-center text-3xl'>We just don't give our students only lectures but real life experiences. Learn smartly with us. We teach 'One Smart Lesson' at a time!</p>
        </header>

        <div className="actions flex max-sm:items-center max-sm:justify-center justify-center max-sm:mx-4 max-sm:my-6 mx-8 gap-4">
          <button className='hover:bg-primary-300 hover:border-surface cursor-pointer hover:text-surface transition-colors duration-150 ease-in-out font-bold border-2 max-sm:p-2 p-3 max-sm:w-34 w-40 flex items-center justify-center gap-2 rounded-sm' onClick={()=>{navigate('/learn-more')}}>
            Learn more
            <FaArrowRight size={"12px"}/>
          </button>
          <button className='hover:bg-primary-300 hover:border-surface cursor-pointer hover:text-surface transition-colors duration-150 ease-in-out font-bold border-2 max-sm:p-2 p-3 max-sm:w-34 w-40 flex items-center justify-center gap-2 rounded-sm' onClick={()=>{navigate('/blogs')}}>
            Blogs
            <FaArrowRight size={"12px"}/>
          </button>
        </div>

        <div className='decorative-banner-1 mx-8 my-8 max-sm:py-6 max-sm:px-4 max-sm:mx-4 max-sm:my-8 px-8 py-8 flex flex-col items-center justify-center bg-page text-copy rounded-lg gap-8'>
          <h1 className='font-bold mt-0 max-sm:text-[20px] text-2xl text-center md:w-[70%]'>We're passionate about empowering learners with high-quality, accessible & engaging education.</h1>
          <div className='flex max-md:flex-col max-md:gap-12 max-sm:gap-8 lg:gap-8'>
            <div className='flex-row gap-2 flex items-center justify-center'>
              <h1 className='text-[#fcbd34] max-sm:text-6xl text-5xl font-bold'>25+</h1>
              <p className='max-sm:text-sm font-semibold text-sm h-fit whitespace-nowrap'>Years of Teaching <br/> & Education Experience</p>
            </div>
            <div className='flex-row gap-2 flex items-center justify-center'>
              <h1 className='text-[#fcbd34] max-sm:text-6xl text-5xl font-bold'>2K+</h1>
              <p className='max-sm:text-sm font-semibold text-sm h-fit whitespace-nowrap'>Students Enrolled</p>
            </div>
            <div className='flex-row gap-2 flex items-center justify-center'>
              <h1 className='text-[#fcbd34] max-sm:text-6xl text-5xl font-bold'>155+</h1>
              <p className='max-sm:text-sm font-semibold text-sm h-fit whitespace-nowrap'>Experienced <br/> Instructors Service</p>
            </div>
          </div>
        </div>

        <section aria-label="Features" className='text-surface max-sm:mx-4 max-sm:my-6 mx-8 my-8 grid grid-cols-2 grid-rows-2 gap-4'>

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