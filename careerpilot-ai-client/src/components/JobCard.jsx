'use client'

import Link from 'next/link'
import Image from 'next/image'

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 card-hover p-6">
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/48/3b82f6/ffffff?text=' + job.company[0];
              }}
            />
          ) : (
            <span className="text-2xl font-bold text-primary-600">{job.company[0]}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Link href={`/jobs/${job.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition line-clamp-1">
              {job.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600">{job.company}</p>
          
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span>💰</span> {job.salary}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="flex items-center gap-1">
              <span>📍</span> {job.location}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
              {job.type}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {job.experience}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-yellow-400">⭐</span>
              <span>{job.rating}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              <span>📅 Apply by {job.applyDeadline}</span>
            </div>
            <Link
              href={`/jobs/${job.id}`}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition flex items-center gap-1"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;