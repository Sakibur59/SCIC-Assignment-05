'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  FaBriefcase, 
  FaFileAlt, 
  FaRobot, 
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaUser,
  FaCalendar,
  FaCheckCircle,
  FaClock,
  FaStar
} from 'react-icons/fa';
import ApplicationsChart from '@/components/charts/ApplicationsChart';
import ResumeScoreChart from '@/components/charts/ResumeScoreChart';
import AIUsageChart from '@/components/charts/AIUsageChart';
import SkillProgressChart from '@/components/charts/SkillProgressChart';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    interviews: 0,
    offers: 0,
    resumeScore: 0,
    aiUsage: 0,
    skillProgress: 0,
    applicationsThisMonth: 0,
    applicationChange: 0,
    resumeScoreChange: 0,
    aiUsageChange: 0,
    skillProgressChange: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      // Simulate fetching dashboard data
      setTimeout(() => {
        setStats({
          totalApplications: 47,
          pendingApplications: 12,
          interviews: 8,
          offers: 3,
          resumeScore: 85,
          aiUsage: 156,
          skillProgress: 72,
          applicationsThisMonth: 15,
          applicationChange: 12.5,
          resumeScoreChange: 8.3,
          aiUsageChange: 23.7,
          skillProgressChange: 5.2,
        });
        setLoading(false);
      }, 1000);
    }
  }, [status, router]);

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {session?.user?.name || 'User'}! Here's your career overview.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <FaCalendar className="text-gray-400" />
            Last 30 days
          </span>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaBriefcase className="text-blue-500" />}
          label="Total Applications"
          value={stats.totalApplications}
          change={stats.applicationChange}
          color="blue"
        />
        <StatCard
          icon={<FaFileAlt className="text-green-500" />}
          label="Resume Score"
          value={`${stats.resumeScore}%`}
          change={stats.resumeScoreChange}
          color="green"
        />
        <StatCard
          icon={<FaRobot className="text-purple-500" />}
          label="AI Usage"
          value={stats.aiUsage}
          change={stats.aiUsageChange}
          color="purple"
        />
        <StatCard
          icon={<FaChartLine className="text-orange-500" />}
          label="Skill Progress"
          value={`${stats.skillProgress}%`}
          change={stats.skillProgressChange}
          color="orange"
        />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <QuickStat
          icon={<FaCheckCircle className="text-green-500" />}
          label="Interviews"
          value={stats.interviews}
        />
        <QuickStat
          icon={<FaStar className="text-yellow-500" />}
          label="Offers"
          value={stats.offers}
        />
        <QuickStat
          icon={<FaClock className="text-orange-500" />}
          label="Pending"
          value={stats.pendingApplications}
        />
        <QuickStat
          icon={<FaCalendar className="text-blue-500" />}
          label="This Month"
          value={stats.applicationsThisMonth}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Applications Overview</h3>
          <ApplicationsChart />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resume Score History</h3>
          <ResumeScoreChart />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Usage Analytics</h3>
          <AIUsageChart />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Skill Progress</h3>
          <SkillProgressChart />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <ActivityItem
            icon={<FaFileAlt className="text-blue-500" />}
            title="Resume Uploaded"
            description="You uploaded 'Software Engineer Resume.pdf'"
            time="2 hours ago"
          />
          <ActivityItem
            icon={<FaRobot className="text-purple-500" />}
            title="AI Analysis Complete"
            description="Your resume was analyzed. Score: 85%"
            time="5 hours ago"
          />
          <ActivityItem
            icon={<FaBriefcase className="text-green-500" />}
            title="Application Submitted"
            description="Applied for Senior Full Stack Developer at Google"
            time="1 day ago"
          />
          <ActivityItem
            icon={<FaChartLine className="text-orange-500" />}
            title="Skill Progress Updated"
            description="React skill increased to 85%"
            time="2 days ago"
          />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
const StatCard = ({ icon, label, value, change, color }) => {
  const isPositive = change >= 0;
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'} bg-green-50 px-2 py-1 rounded-full`}>
          {isPositive ? <FaArrowUp className="inline mr-1" /> : <FaArrowDown className="inline mr-1" />}
          {Math.abs(change)}%
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
};

// Quick Stat Component
const QuickStat = ({ icon, label, value }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ icon, title, description, time }) => {
  return (
    <div className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="text-xl mt-1">{icon}</div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
    </div>
  );
};