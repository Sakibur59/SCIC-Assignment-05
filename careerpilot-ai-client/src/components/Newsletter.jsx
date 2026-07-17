'use client'

import { useState, useEffect, useRef } from 'react'
import { FaEnvelope, FaPaperPlane, FaCheckCircle, FaSpinner } from 'react-icons/fa'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) return

    setStatus('loading')

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStatus('success')
      setEmail('')
      
      // Reset after 4 seconds
      setTimeout(() => setStatus('idle'), 4000)
    } catch (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-20">✨</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-bounce delay-500 opacity-20">⭐</div>
        <div className="absolute top-1/3 right-20 text-3xl animate-bounce delay-1000 opacity-20">🚀</div>
        <div className="absolute bottom-1/3 left-20 text-3xl animate-bounce delay-700 opacity-20">💡</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          className={`max-w-3xl mx-auto text-center text-white transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Icon with Glow */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl border border-white/20 shadow-2xl">
              ✉️
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Stay Updated with{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
              Career Insights
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Subscribe to our newsletter for weekly career tips, job alerts, and AI insights delivered straight to your inbox.
          </p>

          {/* Form */}
          <form 
            onSubmit={handleSubmit} 
            className="relative max-w-lg mx-auto"
          >
            <div className="relative flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-sm p-2 rounded-full border border-white/20 shadow-2xl transition-all duration-300 hover:shadow-2xl hover:border-white/30">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-white/60 text-sm" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-11 pr-4 py-3.5 bg-transparent text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                  required
                  disabled={status === 'loading' || status === 'success'}
                />
              </div>
              
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`
                  px-8 py-3.5 rounded-full font-semibold text-gray-900 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap
                  ${status === 'loading' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : status === 'success'
                    ? 'bg-green-400 cursor-default'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 shadow-lg hover:shadow-yellow-500/25'
                  }
                `}
              >
                {status === 'loading' && (
                  <>
                    <FaSpinner className="animate-spin" />
                    Subscribing...
                  </>
                )}
                {status === 'success' && (
                  <>
                    <FaCheckCircle />
                    Subscribed!
                  </>
                )}
                {status === 'idle' && (
                  <>
                    <FaPaperPlane />
                    Subscribe
                  </>
                )}
              </button>
            </div>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="mt-4 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm text-green-100 px-6 py-3 rounded-full border border-green-400/30">
                  <FaCheckCircle className="text-green-400" />
                  <span className="font-medium">Thanks for subscribing! Check your inbox. 📬</span>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mt-4 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm text-red-100 px-6 py-3 rounded-full border border-red-400/30">
                  <span>❌</span>
                  <span className="font-medium">Something went wrong. Please try again.</span>
                </div>
              </div>
            )}
          </form>

          {/* Trust Badges */}
          <div className={`mt-8 flex flex-wrap justify-center gap-6 text-sm text-blue-200 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✓</span>
              <span>No spam, unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✓</span>
              <span>Weekly career insights</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✓</span>
              <span>Free forever</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter