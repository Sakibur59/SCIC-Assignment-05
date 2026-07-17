import Link from 'next/link'
import { FaRobot, FaTwitter, FaLinkedin, FaGithub, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <FaRobot className="text-primary-500 text-2xl" />
              <span className="font-bold text-xl text-white">
                CareerPilot <span className="text-primary-500">AI</span>
              </span>
            </Link>
            <p className="text-sm">
              Your AI-powered career development platform for landing your dream job.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FaLinkedin /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FaGithub /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FaYoutube /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="hover:text-white transition">Explore Jobs</Link></li>
              <li><Link href="/companies" className="hover:text-white transition">Companies</Link></li>
              <li><Link href="/ai-tools" className="hover:text-white transition">AI Tools</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-white transition">Career Blog</Link></li>
              <li><Link href="/guide" className="hover:text-white transition">Career Guide</Link></li>
              <li><Link href="/resume-tips" className="hover:text-white transition">Resume Tips</Link></li>
              <li><Link href="/interview-prep" className="hover:text-white transition">Interview Prep</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 support@careerpilot.ai</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 San Francisco, CA</li>
              <li className="mt-2">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs">
                  🚀 Available Now
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>© 2024 CareerPilot AI. All rights reserved. Built with ❤️ for your career success.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer