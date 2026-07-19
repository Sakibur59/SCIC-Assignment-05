'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaArrowLeft,
  FaDownload,
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaFilePdf,
  FaCalendarAlt,
  FaUserGraduate,
  FaBriefcase,
  FaTools,
  FaLightbulb,
  FaChartLine,
  FaSpinner,
  FaRobot,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ResumeDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const resumeId = params?.id;

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated' && resumeId) {
      fetchResumeDetails();
    }
  }, [status, router, resumeId]);

  const fetchResumeDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/resume/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResume(data.resume);
      } else {
        toast.error(data.message || 'Failed to fetch resume details');
        router.push('/resume');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Failed to load resume details');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);

    try {
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify({ resumeId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Analysis completed!');
        fetchResumeDetails();
      } else {
        toast.error(data.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!resumeId) {
      toast.error('No resume to generate a report for');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/resume/${resumeId}/report`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to generate report');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Resume_Analysis_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded!');
    } catch (error) {
      console.error('Download report error:', error);
      toast.error(error.message || 'Could not download report');
    }
  };

  // Render stars
  const renderStars = (score) => {
    const stars = [];
    const filledStars = Math.floor(score / 20);
    const hasHalf = score % 20 >= 10;

    for (let i = 0; i < 5; i++) {
      if (i < filledStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === filledStars && hasHalf) {
        stars.push(<FaStarHalf key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="container-custom py-8 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h2 className="text-2xl font-bold text-gray-700">Resume Not Found</h2>
        <p className="text-gray-500 mt-2">The resume you're looking for doesn't exist.</p>
        <Link href="/resume" className="inline-block mt-4 text-primary-600 hover:text-primary-700">
          ← Back to Resumes
        </Link>
      </div>
    );
  }

  const analysis = resume.analysis || {};
  const hasAnalysis = analysis.score || analysis.overallScore;
  const score = analysis.overallScore || analysis.score || 0;

  return (
    <div className="container-custom py-8">
      {/* Back Button */}
      <Link
        href="/resume"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition mb-6"
      >
        <FaArrowLeft className="text-sm" />
        Back to Resumes
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 text-3xl">
              <FaFilePdf />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{resume.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-400" />
                  Uploaded: {formatDate(resume.createdAt)}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="flex items-center gap-1">
                  <FaFilePdf className="text-gray-400" />
                  {(resume.fileSize / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {!hasAnalysis && (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaRobot />
                    Analyze with AI
                  </>
                )}
              </button>
            )}
            {hasAnalysis && (
              <button
                onClick={handleDownloadReport}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <FaDownload />
                Download Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {hasAnalysis ? (
        <div className="space-y-6">
          {/* Score Overview */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800">{score}%</span>
                    <span className="text-xs text-gray-500">Overall Score</span>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(score)}
                  <span className="text-sm text-gray-500">({score}/100)</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Resume Analysis Complete</h3>
                <p className="text-gray-600">{analysis.summary || 'No summary available.'}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-sm text-gray-500">ATS Score</p>
              <p className="text-2xl font-bold text-green-600">{analysis.atsScore || 0}%</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${analysis.atsScore || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-sm text-gray-500">Skills Detected</p>
              <p className="text-2xl font-bold text-blue-600">{analysis.skills?.length || 0}</p>
              <p className="text-xs text-gray-400">Total skills found</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-sm text-gray-500">Experience</p>
              <p className="text-2xl font-bold text-purple-600">{analysis.experience?.length || 0}</p>
              <p className="text-xs text-gray-400">Years of experience</p>
            </div>
          </div>

          {/* Skills */}
          {analysis.skills && analysis.skills.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaTools className="text-blue-500" />
                🛠️ Skills Detected
              </h3>
              <div className="space-y-3">
                {analysis.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{skill.name}</span>
                      <span className="text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {analysis.experience && analysis.experience.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaBriefcase className="text-purple-500" />
                💼 Experience
              </h3>
              <div className="space-y-4">
                {analysis.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-medium text-gray-800">{exp.title}</h4>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <p className="text-xs text-gray-400">{exp.duration}</p>
                    <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {analysis.education && analysis.education.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUserGraduate className="text-green-500" />
                🎓 Education
              </h3>
              <div className="space-y-3">
                {analysis.education.map((edu, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                      {edu.institution?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{edu.degree}</h4>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      <p className="text-xs text-gray-400">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
            <div className="bg-yellow-50 rounded-xl shadow-md border border-yellow-200 p-6">
              <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <FaLightbulb className="text-yellow-500" />
                🔑 Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="text-sm text-yellow-700 mt-3">
                💡 Add these keywords to improve your ATS score
              </p>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div className="bg-primary-50 rounded-xl shadow-md border border-primary-200 p-6">
              <h3 className="font-semibold text-primary-800 mb-3 flex items-center gap-2">
                <FaChartLine className="text-primary-500" />
                💡 Suggestions for Improvement
              </h3>
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-primary-700">
                    <span className="text-primary-500 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Resume Not Analyzed Yet</h3>
          <p className="text-gray-500 mb-6">
            Click the "Analyze with AI" button to get a detailed analysis
          </p>
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <FaSpinner className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FaRobot />
                Analyze with AI
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}