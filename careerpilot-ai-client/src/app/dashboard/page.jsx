'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaFileAlt,
  FaChartLine,
  FaBookmark,
  FaCalendar,
  FaCheckCircle,
  FaExclamationCircle,
  FaPlus,
} from 'react-icons/fa';
import { dashboardAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      loadStats();
    }
  }, [status, router]);

  const loadStats = async () => {
    try {
      const res = await dashboardAPI.getStats();
      setStats(res.data);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      toast.error('Could not load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
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

  const hasResume = !!stats?.latestResume;

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
        <Link
          href="/ai-document"
          className="mt-4 md:mt-0 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm flex items-center gap-2"
        >
          <FaPlus /> Analyze a Resume
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<FaFileAlt className="text-blue-500" />}
          label="Resumes Uploaded"
          value={stats?.resumeCount ?? 0}
          color="blue"
        />
        <StatCard
          icon={<FaChartLine className="text-green-500" />}
          label="Latest ATS Score"
          value={hasResume ? `${stats.latestResume.atsScore ?? '—'}%` : '—'}
          color="green"
        />
        <StatCard
          icon={<FaBookmark className="text-purple-500" />}
          label="Saved Jobs"
          value={stats?.savedJobsCount ?? 0}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Resume Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Latest Resume Analysis</h3>

          {!hasResume ? (
            <div className="text-center py-8">
              <FaExclamationCircle className="text-3xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">
                You haven't analyzed a resume yet.
              </p>
              <Link
                href="/ai-document"
                className="text-primary-600 font-medium text-sm hover:underline"
              >
                Upload your first resume →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-medium text-gray-800">{stats.latestResume.title}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {stats.latestResume.score ?? '—'}
                  </p>
                  <p className="text-xs text-gray-500">Overall Score</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {stats.latestResume.atsScore ?? '—'}
                  </p>
                  <p className="text-xs text-gray-500">ATS Score</p>
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
                <span>{stats.latestResume.skillsCount} skills detected</span>
                <span>{stats.latestResume.missingKeywordsCount} missing keywords</span>
              </div>
            </div>
          )}
        </div>

        {/* Saved Jobs Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Jobs</h3>

          {!stats?.savedJobsCount ? (
            <div className="text-center py-8">
              <FaBookmark className="text-3xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">No saved jobs yet.</p>
              <Link href="/jobs" className="text-primary-600 font-medium text-sm hover:underline">
                Browse jobs →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.savedJobsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-gray-600 flex items-center gap-2">
                    <FaCheckCircle className="text-primary-400 text-xs" />
                    {status}
                  </span>
                  <span className="font-medium text-gray-800">{count}</span>
                </div>
              ))}

              <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
                {stats.recentSavedJobs.map((job) => (
                  <div key={job._id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 truncate">{job.title}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {job.company}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className={`p-2 rounded-lg inline-block ${colorClasses[color]} mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
};