'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getJobById, getSimilarJobs } from '@/app/data/jobs'
import JobDetails from '@/components/JobDetails'


export default function JobDetailsPage() {
  const params = useParams()
  const [job, setJob] = useState(null)
  const [similarJobs, setSimilarJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      // Simulate API call
      setLoading(true)
      setTimeout(() => {
        const jobData = getJobById(params.id)
        if (jobData) {
          setJob(jobData)
          const similar = getSimilarJobs(jobData)
          setSimilarJobs(similar)
        }
        setLoading(false)
      }, 1000)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 animate-pulse">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 max-w-2xl mx-auto">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-2xl font-bold text-gray-700">Job Not Found</h2>
          <p className="text-gray-500 mt-2">The job you're looking for doesn't exist or has been removed.</p>
          <Link href="/jobs" className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>›</span>
        <Link href="/jobs" className="hover:text-primary-600">Jobs</Link>
        <span>›</span>
        <span className="text-gray-700">{job.title}</span>
      </nav>

      {/* Job Details */}
      <JobDetails job={job} />

      {/* Similar Jobs */}
      {similarJobs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Similar Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarJobs.map((similarJob) => (
              <Link
                key={similarJob.id}
                href={`/jobs/${similarJob.id}`}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-100 card-hover"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-xl font-bold text-primary-600">
                    {similarJob.company[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{similarJob.title}</h4>
                    <p className="text-sm text-gray-600 truncate">{similarJob.company}</p>
                    <p className="text-sm text-gray-500">{similarJob.salary}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}