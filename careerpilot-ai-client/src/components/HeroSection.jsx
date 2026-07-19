'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaSearch, 
  FaUpload, 
  FaRobot, 
  FaArrowRight, 
  FaCheckCircle 
} from 'react-icons/fa';
import { useSession } from 'next-auth/react';

const HeroSection = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearchJobs = () => {
    router.push('/jobs');
  };


  const handleAIAnalysis = () => {
    if (session) {
      router.push('/ai-document');
    } else {
      router.push('/login');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white min-h-[90vh] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-20">✨</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-bounce delay-500 opacity-20">⭐</div>
        <div className="absolute top-1/3 right-20 text-3xl animate-bounce delay-1000 opacity-20">🚀</div>
        <div className="absolute bottom-1/3 left-20 text-3xl animate-bounce delay-700 opacity-20">💡</div>
        <div className="absolute top-20 left-1/4 text-2xl animate-spin-slow opacity-10">⚡</div>
        <div className="absolute bottom-20 right-1/4 text-2xl animate-spin-slow delay-1000 opacity-10">⚡</div>
        
        {/* Grid pattern overlay (Hydration Safe Structure) */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-medium">🚀 AI-Powered Career Platform</span>
              <span className="text-white/40">|</span>
              <span className="font-semibold text-yellow-300">v2.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Your AI Copilot for{' '}
              <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 bg-clip-text text-transparent bg-300% animate-gradient">
                Career Growth
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100/90 max-w-lg leading-relaxed">
              Land your dream job with AI-powered resume analysis, smart job matching,
              and personalized career insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleSearchJobs}
                className="group relative px-8 py-3.5 bg-white text-gray-900 font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FaSearch className="text-primary-600" />
                  Search Jobs
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={handleAIAnalysis}
                className="group px-8 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <FaRobot className="animate-pulse" />
                AI Analysis
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">Beta</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-blue-100/80">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                <span>12,500+ jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                <span>94% match rate</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                <span>AI powered insights</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full border-2 border-white/20 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  <span className="text-yellow-300">10,000+</span> professionals
                </p>
                <p className="text-xs text-blue-100/60">trust CareerPilot AI</p>
              </div>
            </div>
          </div>

          {/* Right Content - Stats/Features Grid */}
          <div className={`grid grid-cols-2 gap-4 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
                <h4 className="font-semibold text-white">ATS Score</h4>
                <p className="text-sm text-blue-100/60">Check compatibility</p>
                <div className="mt-3 flex items-center gap-1">
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-xs font-bold text-yellow-300">85%</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
                <h4 className="font-semibold text-white">Job Matches</h4>
                <p className="text-sm text-blue-100/60">Smart recommendations</p>
                <div className="mt-3 flex items-center gap-1">
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                  </div>
                  <span className="text-xs font-bold text-green-300">92%</span>
                </div>
              </div>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📈</div>
                <h4 className="font-semibold text-white">Skill Gap</h4>
                <p className="text-sm text-blue-100/60">AI identifies gaps</p>
                <div className="mt-3 flex items-center gap-1">
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                  </div>
                  <span className="text-xs font-bold text-purple-300">65%</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🚀</div>
                <h4 className="font-semibold text-white">Career Growth</h4>
                <p className="text-sm text-blue-100/60">Personalized path</p>
                <div className="mt-3 flex items-center gap-1">
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[78%] bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"></div>
                  </div>
                  <span className="text-xs font-bold text-blue-300">78%</span>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">12k+</p>
                  <p className="text-xs text-blue-100/60">Active Jobs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">94%</p>
                  <p className="text-xs text-blue-100/60">Success Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4.8⭐</p>
                  <p className="text-xs text-blue-100/60">User Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#paint0_linear)"/>
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="1440" y2="0">
              <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0"/>
              <stop offset="50%" stopColor="#0f3460" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;