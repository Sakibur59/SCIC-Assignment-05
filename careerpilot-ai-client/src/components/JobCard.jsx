'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaBookmark, FaMapMarkerAlt, FaBuilding, FaStar, FaRegBookmark } from 'react-icons/fa';
import toast from 'react-hot-toast';

const JobCard = ({ job }) => {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      if (!session?.user) return;
      try {
        const response = await fetch(`/api/saved-jobs/check?jobId=${job.id}`);
        const data = await response.json();
        setIsSaved(data.saved);
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };
    checkSaved();
  }, [job.id, session]);

  const handleSaveJob = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.error('Please login to save jobs');
      return;
    }

    setSaving(true);

    try {
      if (isSaved) {
        const response = await fetch(`/api/saved-jobs?jobId=${job.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setIsSaved(false);
          toast.success('Job removed from saved list');
        } else {
          const data = await response.json();
          toast.error(data.message || 'Failed to remove job');
        }
      } else {
        const response = await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId: job.id,
            jobData: {
              title: job.title,
              company: job.company,
              location: job.location,
              salary: job.salary,
              type: job.type,
              description: job.description,
              companyLogo: job.companyLogo,
            },
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setIsSaved(true);
          toast.success('Job saved successfully!');
        } else {
          toast.error(data.message || 'Failed to save job');
        }
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  // Helper to get initials
  const getInitials = (companyName) => {
    if (!companyName) return '?';
    return companyName.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 card-hover p-6 relative">
      <div className="flex items-start gap-4">
        {/* Company Logo - Fixed */}
        <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-primary-200">
          {!logoError && job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-12 h-12 object-contain rounded"
              onError={() => setLogoError(true)}
              loading="lazy"
            />
          ) : (
            <span className="text-xl font-bold text-primary-700">
              {getInitials(job.company)}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/jobs/${job.id}`} className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition line-clamp-1">
                {job.title}
              </h3>
            </Link>
            
            <button
              onClick={handleSaveJob}
              disabled={saving}
              className={`flex-shrink-0 p-2 rounded-full transition ${
                isSaved 
                  ? 'text-primary-600 bg-primary-50 hover:bg-primary-100' 
                  : 'text-gray-400 hover:text-primary-600 hover:bg-gray-50'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              {isSaved ? (
                <FaBookmark className="text-lg" />
              ) : (
                <FaRegBookmark className="text-lg" />
              )}
            </button>
          </div>
          
          <p className="text-sm font-medium text-gray-700">{job.company}</p>
          
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              💰 {job.salary}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-gray-400 text-xs" />
              {job.location}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full font-medium">
              {job.type}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
              {job.experience}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <FaStar className="text-yellow-400" />
              <span className="text-gray-600 font-medium">{job.rating}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              📅 Apply by {job.applyDeadline}
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