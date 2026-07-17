'use client'

import { FaBrain, FaFileAlt, FaChartLine, FaRocket } from 'react-icons/fa'

const features = [
  {
    icon: FaBrain,
    title: 'Smart Job Matching',
    description: 'AI-powered algorithms match your skills with the perfect job opportunities.'
  },
  {
    icon: FaFileAlt,
    title: 'Resume Analysis',
    description: 'Get instant feedback and suggestions to improve your resume for ATS systems.'
  },
  {
    icon: FaChartLine,
    title: 'Career Insights',
    description: 'Data-driven insights about market trends and skill demands in your industry.'
  },
  {
    icon: FaRocket,
    title: 'Interview Preparation',
    description: 'Practice with AI-powered mock interviews and get real-time feedback.'
  }
]

const AIFeatures = () => {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">🚀 AI-Powered Features</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Leverage cutting-edge AI technology to accelerate your career growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 card-hover text-center"
            >
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto text-primary-600 text-2xl">
                <feature.icon />
              </div>
              <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AIFeatures