'use client'

import { FaUserPlus, FaUpload, FaSearch, FaRocket } from 'react-icons/fa'

const steps = [
  {
    icon: FaUserPlus,
    title: 'Create Profile',
    description: 'Sign up and create your professional profile with skills and experience.'
  },
  {
    icon: FaUpload,
    title: 'Upload Resume',
    description: 'Upload your resume for AI-powered analysis and optimization.'
  },
  {
    icon: FaSearch,
    title: 'Get Matched',
    description: 'Our AI finds the best job matches based on your profile and preferences.'
  },
  {
    icon: FaRocket,
    title: 'Land Your Dream Job',
    description: 'Apply with confidence and track your application progress.'
  }
]

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">How CareerPilot Works</h2>
          <p className="text-gray-600 mt-2">Four simple steps to accelerate your career</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 card-hover text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl">
                    <step.icon />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary-300">
                      <div className="w-2 h-2 bg-primary-600 rounded-full -mt-1 ml-auto"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mt-4">{step.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks