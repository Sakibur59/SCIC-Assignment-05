'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  FaBookmark, 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaArrowRight,
  FaStar,
  FaRegBookmark,
  FaEye,
  FaSpinner
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { jobsData } from '@/app/data/jobs';
const FeaturedJobs = () => {
  const { data: session } = useSession();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    // Get first 6 jobs as featured
    setFeaturedJobs(jobsData.slice(0, 6));
  }, []);

  const handleSaveJob = async (jobId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error('Please login to save jobs');
      return;
    }

    setSaving(jobId);

    try {
      if (savedJobs.includes(jobId)) {
        // Unsave
        const response = await fetch(`/api/saved-jobs?jobId=${jobId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        });
        
        if (response.ok) {
          setSavedJobs(savedJobs.filter(id => id !== jobId));
          toast.success('Job removed from saved list');
        } else {
          toast.error('Failed to remove job');
        }
      } else {
        // Save
        const job = featuredJobs.find(j => j.id === jobId);
        
        const response = await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify({
            jobId: jobId,
            jobsData: {
              title: job.title,
              company: job.company,
              location: job.location,
              salary: job.salary,
              type: job.type,
              description: job.description,
              companyLogo: job.companyLogo || '',
            },
          }),
        });
        
        if (response.ok) {
          setSavedJobs([...savedJobs, jobId]);
          toast.success('Job saved successfully!');
        } else {
          const data = await response.json();
          toast.error(data.message || 'Failed to save job');
        }
      }
    } catch (error) {
      console.error('Save job error:', error);
      toast.error('An error occurred');
    } finally {
      setSaving(null);
    }
  };

  const isSaved = (jobId) => savedJobs.includes(jobId);

  // Helper to get initials
  const getInitials = (companyName) => {
    if (!companyName) return '?';
    return companyName.charAt(0).toUpperCase();
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">🔥 Featured Jobs</h2>
            <p className="text-gray-500 mt-1">Handpicked opportunities for you</p>
          </div>
          <Link 
            href="/jobs" 
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 group"
          >
            View all
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Card Content */}
              <div className="p-6">
                {/* Company Logo & Bookmark */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${job.company}&background=3b82f6&color=fff&size=40`;
                          }}
                        />
                      ) : (
                        <span className="text-lg font-bold text-primary-600">
                          {getInitials(job.company)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full font-medium">
                      {job.type}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleSaveJob(job.id, e)}
                    disabled={saving === job.id}
                    className="text-gray-300 hover:text-primary-500 transition-colors disabled:opacity-50"
                  >
                    {saving === job.id ? (
                      <FaSpinner className="animate-spin" />
                    ) : isSaved(job.id) ? (
                      <FaBookmark className="text-primary-500" />
                    ) : (
                      <FaRegBookmark />
                    )}
                  </button>
                </div>

                {/* Job Title */}
                <h3 className="text-lg font-bold text-gray-800 mt-3 group-hover:text-primary-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                
                {/* Company */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <FaBuilding className="text-gray-400 text-xs" />
                  <span>{job.company}</span>
                </div>
                
                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <FaMapMarkerAlt className="text-gray-400 text-xs" />
                  <span>{job.location}</span>
                </div>

                {/* Rating & Experience */}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span>{job.rating}</span>
                  </div>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{job.experience}</span>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {job.tags?.length > 3 && (
                    <span className="text-xs text-gray-400">+{job.tags.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <div>
                  <span className="text-primary-600 font-semibold">{job.salary}</span>
                  <p className="text-xs text-gray-400">Apply by {job.applyDeadline}</p>
                </div>
                
                {/* View Details Button */}
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-sm bg-primary-600 text-white px-4 py-1.5 rounded-full hover:bg-primary-700 transition flex items-center gap-1.5"
                >
                  <FaEye className="text-xs" />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;