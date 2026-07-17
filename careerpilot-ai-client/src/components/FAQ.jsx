'use client'

import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const faqs = [
  {
    question: 'How does CareerPilot AI work?',
    answer: 'CareerPilot AI uses advanced machine learning algorithms to analyze your resume, skills, and career goals. It then matches you with the most suitable job opportunities and provides personalized recommendations for improvement.'
  },
  {
    question: 'Is CareerPilot AI free to use?',
    answer: 'We offer both free and premium plans. The free plan includes basic resume analysis and job matching. Premium plans include advanced features like interview preparation, career coaching, and priority support.'
  },
  {
    question: 'How accurate is the resume analysis?',
    answer: 'Our AI-powered resume analysis has an accuracy rate of 94% in predicting ATS compatibility and identifying areas for improvement. It provides detailed feedback on keywords, formatting, and content optimization.'
  },
  {
    question: 'Can I use CareerPilot AI for any industry?',
    answer: 'Yes! CareerPilot AI supports professionals across all industries including technology, finance, healthcare, marketing, engineering, and more. Our AI is continuously trained on diverse job market data.'
  },
  {
    question: 'How do I get started?',
    answer: 'Getting started is simple! Create your account, upload your resume, and let our AI do the rest. You\'ll receive personalized job matches and improvement suggestions within minutes.'
  }
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">❓ Frequently Asked Questions</h2>
          <p className="text-gray-600 mt-2">Find answers to common questions about CareerPilot AI</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-100 mb-3 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-800 text-left">{faq.question}</span>
                {openIndex === index ? (
                  <FaChevronUp className="text-primary-600" />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ