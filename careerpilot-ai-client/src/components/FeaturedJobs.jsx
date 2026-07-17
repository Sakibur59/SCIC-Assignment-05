'use client'

import { FaBookmark, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa'

const jobs = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $180k',
    tags: ['React', 'Node.js', 'AWS']
  },
  {
    id: 2,
    title: 'AI/ML Engineer',
    company: 'DataFlow AI',
    location: 'Remote',
    type: 'Remote',
    salary: '$140k - $200k',
    tags: ['Python', 'TensorFlow', 'PyTorch']
  },
  {
    id: 3,
    title: 'Product Designer',
    company: 'Creative Studio',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$90k - $140k',
    tags: ['Figma', 'UI/UX', 'Design Systems']
  }
]

const FeaturedJobs = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">🔥 Featured Jobs</h2>
          <a href="/jobs" className="text-primary-600 hover:underline text-sm font-medium flex items-center gap-1">
            View all →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 card-hover cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                    {job.type}
                  </span>
                </div>
                <FaBookmark className="text-gray-400 hover:text-primary-500 cursor-pointer transition" />
              </div>

              <h3 className="text-lg font-bold mt-3">{job.title}</h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <FaBuilding className="text-gray-400" />
                <span>{job.company}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <FaMapMarkerAlt className="text-gray-400" />
                <span>{job.location}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-primary-600 font-semibold">{job.salary}</span>
                <button className="text-sm bg-primary-600 text-white px-4 py-1 rounded-full hover:bg-primary-700 transition">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedJobs