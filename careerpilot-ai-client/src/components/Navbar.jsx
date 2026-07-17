'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaRobot, FaUserCircle, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Explore Jobs', href: '/jobs' },
    { name: 'Companies', href: '/companies' },
    { name: 'AI Tools', href: '/ai-tools' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <FaRobot className="text-primary-600 text-2xl" />
            <span className="font-bold text-xl text-gray-900">
              CareerPilot <span className="text-primary-600">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Dashboard & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-1"
            >
              <FaUserCircle className="text-lg" />
              Dashboard
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-full transition shadow-sm flex items-center gap-2"
            >
              <FaSignInAlt />
              Login / Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 hover:text-primary-600 transition"
          >
            {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-200 flex flex-col space-y-3">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-2 py-1 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserCircle /> Dashboard
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-full transition text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar