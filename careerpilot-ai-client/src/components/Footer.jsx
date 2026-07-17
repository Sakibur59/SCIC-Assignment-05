import Link from 'next/link';
import { FaRobot, FaTwitter, FaLinkedin, FaGithub, FaYoutube, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 relative">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Back to top"
      >
        <FaArrowUp className="text-sm" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <FaRobot className="text-blue-500 text-2xl" />
              </div>
              <span className="font-bold text-xl text-white">
                CareerPilot <span className="text-blue-500">AI</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your AI-powered career development platform for landing your dream job.
            </p>
            <div className="flex gap-3 pt-2">
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-blue-600 p-2.5 rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                aria-label="Twitter"
              >
                <FaTwitter className="text-lg" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-blue-700 p-2.5 rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-lg" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-gray-700 p-2.5 rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                aria-label="GitHub"
              >
                <FaGithub className="text-lg" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-red-600 p-2.5 rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                aria-label="YouTube"
              >
                <FaYoutube className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Quick Links
              <div className="w-10 h-0.5 bg-blue-500 mt-2"></div>
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/jobs" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  → Explore Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  → Companies
                </Link>
              </li>
              <li>
                <Link href="/ai-tools" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  → AI Tools
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  → About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Resources
              <div className="w-10 h-0.5 bg-blue-500 mt-2"></div>
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  → Career Blog
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  → Career Guide
                </Link>
              </li>
              <li>
                <Link href="/resume-tips" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  → Resume Tips
                </Link>
              </li>
              <li>
                <Link href="/interview-prep" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  → Interview Prep
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Contact
              <div className="w-10 h-0.5 bg-blue-500 mt-2"></div>
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-3 hover:text-white transition-colors duration-200">
                <span className="text-lg">📧</span>
                <span>support@careerpilot.ai</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors duration-200">
                <span className="text-lg">📞</span>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors duration-200">
                <span className="text-lg">📍</span>
                <span>San Francisco, CA</span>
              </li>
              <li className="mt-4">
                <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg shadow-blue-600/20 animate-pulse">
                  🚀 Available Now
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider and Copyright */}
        <div className="border-t border-gray-800/50 mt-10 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              © {new Date().getFullYear()} CareerPilot AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span className="text-gray-600">❤️</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;