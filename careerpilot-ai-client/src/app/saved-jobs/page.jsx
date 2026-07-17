'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaBookmark, 
  FaMapMarkerAlt, 
  FaStar, 
  FaTrash,
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaBuilding,
  FaRegBookmark,
  FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function SavedJobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [jobToRemove, setJobToRemove] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchSavedJobs();
    }
  }, [status, router]);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/saved-jobs');
      const data = await response.json();
      
      if (response.ok) {
        setSavedJobs(data.savedJobs || []);
      } else {
        toast.error(data.message || 'Failed to load saved jobs');
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  // Open modal
  const openRemoveModal = (jobId) => {
    setJobToRemove(jobId);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setJobToRemove(null);
  };

  // Handle remove with modal
  const handleConfirmRemove = async () => {
    if (!jobToRemove) return;

    setRemoving(jobToRemove);
    closeModal();

    try {
      const response = await fetch(`/api/saved-jobs?jobId=${jobToRemove}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedJobs(savedJobs.filter(job => job.jobId !== jobToRemove.toString()));
        toast.success('Job removed from saved list');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to remove job');
      }
    } catch (error) {
      console.error('Error removing job:', error);
      toast.error('An error occurred');
    } finally {
      setRemoving(null);
      setJobToRemove(null);
    }
  };

  // Helper to get initials
  const getInitials = (companyName) => {
    if (!companyName) return '?';
    return companyName.charAt(0).toUpperCase();
  };

  // Get job details for modal
  const getJobForModal = () => {
    if (!jobToRemove) return null;
    return savedJobs.find(job => job.jobId === jobToRemove.toString());
  };

  const jobToDelete = getJobForModal();

  if (status === 'loading' || loading) {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaBookmark className="text-3xl text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-800">Saved Jobs</h1>
        </div>
        <p className="text-gray-600">
          {savedJobs.length === 0 
            ? "You haven't saved any jobs yet" 
            : `You have ${savedJobs.length} saved job${savedJobs.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Saved</p>
          <p className="text-2xl font-bold text-gray-800">{savedJobs.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Applied</p>
          <p className="text-2xl font-bold text-gray-800">
            {savedJobs.filter(j => j.status === 'applied').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Interviewing</p>
          <p className="text-2xl font-bold text-gray-800">
            {savedJobs.filter(j => j.status === 'interviewing').length}
          </p>
        </div>
      </div>

      {/* Saved Jobs List */}
      {savedJobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
          <div className="text-6xl mb-4">📌</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Saved Jobs</h3>
          <p className="text-gray-500 mb-6">
            Start exploring jobs and save the ones you're interested in
          </p>
          <Link
            href="/jobs"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            Explore Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((savedJob) => {
            const job = savedJob.jobData;
            const jobId = savedJob.jobId;
            
            return (
              <div
                key={savedJob._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 card-hover p-6 relative"
              >
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-primary-200">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-12 h-12 object-contain rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <span class="text-xl font-bold text-primary-700">
                              ${getInitials(job.company)}
                            </span>
                          `;
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-xl font-bold text-primary-700">
                        {getInitials(job.company)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/jobs/${jobId}`} className="block">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition line-clamp-1">
                        {job.title}
                      </h3>
                    </Link>
                    
                    <p className="text-sm font-medium text-gray-700">{job.company}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        💰 {job.salary || 'Not specified'}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-gray-400 text-xs" />
                        {job.location || 'Remote'}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="flex items-center gap-1">
                        <FaBuilding className="text-gray-400 text-xs" />
                        {job.type || 'Full-time'}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        savedJob.status === 'saved' ? 'bg-blue-100 text-blue-700' :
                        savedJob.status === 'applied' ? 'bg-yellow-100 text-yellow-700' :
                        savedJob.status === 'interviewing' ? 'bg-purple-100 text-purple-700' :
                        savedJob.status === 'offered' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {savedJob.status.charAt(0).toUpperCase() + savedJob.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-300" />
                        Saved on {new Date(savedJob.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Notes */}
                    {savedJob.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                        📝 {savedJob.notes}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                      <Link
                        href={`/jobs/${jobId}`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 transition flex items-center gap-1"
                      >
                        View Details →
                      </Link>
                      
                      <div className="flex-1"></div>

                      {/* Status Dropdown */}
                      <select
                        value={savedJob.status}
                        onChange={async (e) => {
                          try {
                            const response = await fetch(`/api/saved-jobs/${savedJob._id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: e.target.value }),
                            });
                            
                            if (response.ok) {
                              toast.success('Status updated');
                              fetchSavedJobs();
                            } else {
                              toast.error('Failed to update status');
                            }
                          } catch (error) {
                            toast.error('An error occurred');
                          }
                        }}
                        className="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="saved">📌 Saved</option>
                        <option value="applied">📤 Applied</option>
                        <option value="interviewing">📞 Interviewing</option>
                        <option value="offered">🎉 Offered</option>
                        <option value="rejected">❌ Rejected</option>
                      </select>

                      {/* Remove Button - Opens Modal */}
                      <button
                        onClick={() => openRemoveModal(jobId)}
                        disabled={removing === jobId}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition flex items-center gap-1 disabled:opacity-50"
                        title="Remove from saved"
                      >
                        <FaTrash className="text-sm" />
                        {removing === jobId ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========== CONFIRMATION MODAL ========== */}
      {showModal && jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Icon */}
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <FaTrash className="text-4xl text-red-500" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              Remove Saved Job?
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-center text-sm mb-6">
              Are you sure you want to remove <strong>"{jobToDelete.jobData?.title}"</strong> from your saved list?
              <br />
              <span className="text-xs text-gray-400">This action cannot be undone.</span>
            </p>

            {/* Job Preview */}
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {jobToDelete.jobData?.companyLogo ? (
                    <img
                      src={jobToDelete.jobData.companyLogo}
                      alt={jobToDelete.jobData.company}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-sm font-bold text-primary-700">
                      {getInitials(jobToDelete.jobData?.company)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">
                    {jobToDelete.jobData?.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {jobToDelete.jobData?.company}
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium flex items-center justify-center gap-2"
              >
                <FaTrash className="text-sm" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Animation CSS - Add to globals.css if not already there */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}