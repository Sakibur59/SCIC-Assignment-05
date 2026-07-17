'use client'

import { useState } from 'react'
import { FaEnvelope } from 'react-icons/fa'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section className="py-16 bg-primary-900">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-800 rounded-full flex items-center justify-center text-3xl">
              ✉️
            </div>
          </div>
          <h2 className="text-3xl font-bold">Stay Updated with Career Insights</h2>
          <p className="mt-2 text-primary-200">
            Subscribe to our newsletter for weekly career tips, job alerts, and AI insights
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            />
            <button
              type="submit"
              className="bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition flex items-center justify-center gap-2"
            >
              <FaEnvelope />
              Subscribe
            </button>
          </form>

          {status === 'success' && (
            <p className="mt-3 text-green-300 text-sm animate-fade-in-up">
              ✅ Thanks for subscribing! Check your inbox.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default Newsletter