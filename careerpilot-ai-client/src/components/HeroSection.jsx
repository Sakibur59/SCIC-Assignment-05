'use client'

import { FaSearch, FaUpload, FaRobot } from 'react-icons/fa'

const HeroSection = () => {
  return (
    <section className="gradient-hero text-white py-20 px-4">
      <div className="container-custom text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Your AI Copilot for{' '}
            <span className="text-yellow-300">Career Growth</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Land your dream job with AI-powered resume analysis, smart job matching,
            and personalized insights.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in-up delay-100">
          <button className="bg-white text-primary-700 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-lg transition flex items-center gap-2">
            <FaSearch /> Search Jobs
          </button>
          <button className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold px-8 py-3 rounded-full shadow-lg transition flex items-center gap-2">
            <FaUpload /> Upload Resume
          </button>
          <button className="bg-primary-500 hover:bg-primary-400 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition flex items-center gap-2">
            <FaRobot /> AI Resume Analysis
          </button>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-blue-100 animate-fade-in-up delay-200">
          <span><span className="text-yellow-300 mr-1">✓</span> 12k+ jobs</span>
          <span><span className="text-yellow-300 mr-1">✓</span> 94% match rate</span>
          <span><span className="text-yellow-300 mr-1">✓</span> AI powered</span>
        </div>
      </div>
    </section>
  )
}

export default HeroSection