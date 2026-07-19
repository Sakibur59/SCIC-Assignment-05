'use client';

import { useState } from 'react';
import { FaBullseye, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { resumeAPI } from '@/app/lib/api';

const buildJobText = (job) => {
  const parts = [];
  parts.push(`Job Title: ${job.title}`);
  parts.push(`Company: ${job.company}`);
  parts.push(`Description: ${job.description}`);
  if (job.responsibilities?.length) {
    parts.push(`Responsibilities:\n- ${job.responsibilities.join('\n- ')}`);
  }
  if (job.requirements?.length) {
    parts.push(`Requirements:\n- ${job.requirements.join('\n- ')}`);
  }
  if (job.tags?.length) {
    parts.push(`Key Skills: ${job.tags.join(', ')}`);
  }
  return parts.join('\n\n');
};

export default function ResumeMatchWidget({ job }) {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [matching, setMatching] = useState(false);
  const [match, setMatch] = useState(null);
  const [opened, setOpened] = useState(false);

  const loadResumes = async () => {
    setOpened(true);
    setLoadingResumes(true);
    try {
      const res = await resumeAPI.getAll();
      const list = res.data.resumes || [];
      setResumes(list);
      if (list.length) setSelectedResumeId(list[0]._id);
    } catch (error) {
      toast.error('Could not load your resumes');
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleCheckMatch = async () => {
    if (!selectedResumeId) {
      toast.error('Please select a resume first');
      return;
    }
    setMatching(true);
    setMatch(null);
    try {
      const jobText = buildJobText(job);
      const res = await resumeAPI.matchJob(selectedResumeId, jobText);
      setMatch(res.data.match);
      toast.success('Match analysis complete!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Match failed. Please try again.');
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <FaBullseye className="text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-800">Check My Resume Match</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        See how well your uploaded resume fits this specific job posting.
      </p>

      {!opened && (
        <button
          onClick={loadResumes}
          className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
        >
          Check My Match
        </button>
      )}

      {opened && loadingResumes && (
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <FaSpinner className="animate-spin" /> Loading your resumes...
        </p>
      )}

      {opened && !loadingResumes && resumes.length === 0 && (
        <p className="text-sm text-gray-600">
          You haven't uploaded a resume yet.{' '}
          <a href="/resume" className="text-primary-600 font-medium hover:underline">
            Upload one first
          </a>{' '}
          to check your match.
        </p>
      )}

      {opened && !loadingResumes && resumes.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            className="flex-1 w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleCheckMatch}
            disabled={matching}
            className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium disabled:opacity-50 whitespace-nowrap"
          >
            {matching ? 'Analyzing...' : 'Run Match'}
          </button>
        </div>
      )}

      {match && (
        <div className="mt-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-primary-600">{match.matchScore}%</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Match Score</p>
              <p className="text-sm text-gray-600">{match.verdict}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                <FaCheckCircle /> Matching Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {match.matchingSkills?.length ? (
                  match.matchingSkills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">None detected</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1">
                <FaTimesCircle /> Missing Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {match.missingSkills?.length ? (
                  match.missingSkills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-red-50 text-red-600 text-xs rounded-full">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">None 🎉</span>
                )}
              </div>
            </div>
          </div>

          {match.strengths?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Strengths</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {match.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {match.gaps?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Gaps</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {match.gaps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {match.tailoredSuggestions?.length > 0 && (
            <div className="bg-primary-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-primary-800 mb-2">Tailored Suggestions</h4>
              <ul className="list-disc list-inside text-sm text-primary-700 space-y-1">
                {match.tailoredSuggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}