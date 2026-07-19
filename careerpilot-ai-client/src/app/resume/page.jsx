'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaUpload, 
  FaFilePdf, 
  FaTrash, 
  FaEdit, 
  FaEye,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaDownload,
  FaPlus,
  FaRobot,
  FaTimes,
  FaFileAlt,
  FaCalendarAlt,
  FaUserGraduate,
  FaCode,
  FaStar,
  FaRegStar,
  FaStarHalf
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import DeleteModal from '@/components/DeleteModal';

export default function ResumePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [analyzing, setAnalyzing] = useState(null);
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      fetchResumes();
    }
  }, [status, router]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resume', {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        setResumes(data.resumes || []);
      } else {
        toast.error(data.message || 'Failed to fetch resumes');
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (resume) => {
    setResumeToDelete(resume);
    setDeleteModalOpen(true);
  };

  // Close Delete Modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setResumeToDelete(null);
  };

  // Handle Delete with Modal
  const handleConfirmDelete = async () => {
    if (!resumeToDelete) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/resume/${resumeToDelete._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });

      if (response.ok) {
        toast.success('Resume deleted successfully');
        fetchResumes();
        closeDeleteModal();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete resume');
    } finally {
      setDeleting(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    if (!resumeTitle) {
      setResumeTitle(file.name.replace('.pdf', ''));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    if (!resumeTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', resumeTitle.trim());

      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Resume uploaded successfully!');
        setShowUploadModal(false);
        setSelectedFile(null);
        setResumeTitle('');
        fetchResumes();
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (resumeId) => {
    setAnalyzing(resumeId);

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
        fetchResumes();
      } else {
        toast.error(data.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setAnalyzing(null);
    }
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Helper to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Render stars for score
  const renderStars = (score) => {
    const stars = [];
    const filledStars = Math.floor(score / 20);
    const hasHalf = score % 20 >= 10;

    for (let i = 0; i < 5; i++) {
      if (i < filledStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else if (i === filledStars && hasHalf) {
        stars.push(<FaStarHalf key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    return stars;
  };

  if (status === 'loading') {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="h-32 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-800">My Resumes</h1>
          <p className="text-gray-600 mt-1">
            Manage your resumes and track their AI analysis scores
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="mt-4 md:mt-0 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
        >
          <FaPlus />
          Upload New Resume
        </button>
      </div>

      {/* Stats Summary */}
      {resumes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Resumes</p>
            <p className="text-2xl font-bold text-gray-800">{resumes.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Analyzed</p>
            <p className="text-2xl font-bold text-gray-800">
              {resumes.filter(r => r.analysis?.score || r.analysis?.overallScore).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="text-2xl font-bold text-gray-800">
              {resumes.filter(r => r.analysis?.score || r.analysis?.overallScore).length > 0
                ? Math.round(
                    resumes
                      .filter(r => r.analysis?.score || r.analysis?.overallScore)
                      .reduce((acc, r) => acc + (r.analysis?.overallScore || r.analysis?.score || 0), 0) /
                    resumes.filter(r => r.analysis?.score || r.analysis?.overallScore).length
                  ) + '%'
                : 'N/A'}
            </p>
          </div>
        </div>
      )}

      {/* Resume List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-20 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Resumes Yet</h3>
          <p className="text-gray-500 mb-6">
            Upload your first resume to get AI-powered analysis
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 mx-auto"
          >
            <FaUpload />
            Upload Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => {
            const score = resume.analysis?.overallScore || resume.analysis?.score || 0;
            const hasAnalysis = resume.analysis && (resume.analysis.score || resume.analysis.overallScore);
            
            return (
              <div
                key={resume._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Card Header */}
                <div className="p-6 pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 text-xl">
                        <FaFilePdf />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {resume.title}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FaCalendarAlt className="text-gray-400" />
                          {formatDate(resume.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 pt-4">
                  {hasAnalysis ? (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Score</span>
                            <span className="text-sm font-bold text-gray-800">{score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-1000 ${
                                score >= 80 ? 'bg-green-500' :
                                score >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-3">
                        {renderStars(score)}
                        <span className="text-xs text-gray-400 ml-1">
                          ({score}/100)
                        </span>
                      </div>

                      {resume.analysis?.suggestions && resume.analysis.suggestions.length > 0 && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          💡 {resume.analysis.suggestions[0]}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-3">Not analyzed yet</p>
                      <button
                        onClick={() => handleAnalyze(resume._id)}
                        disabled={analyzing === resume._id}
                        className="text-sm bg-primary-100 text-primary-600 px-4 py-1.5 rounded-full hover:bg-primary-200 transition flex items-center gap-1 mx-auto"
                      >
                        {analyzing === resume._id ? (
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

                {/* Card Footer - Actions */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/resume/${resume._id}`}
                      className="text-sm text-primary-600 hover:text-primary-700 transition flex items-center gap-1"
                    >
                      <FaEye className="text-xs" />
                      View
                    </Link>
                    {hasAnalysis && (
                      <Link
                        href={`/api/resume/${resume._id}/report`}
                        target="_blank"
                        className="text-sm text-green-600 hover:text-green-700 transition flex items-center gap-1 ml-2"
                      >
                        <FaDownload className="text-xs" />
                        Report
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={() => openDeleteModal(resume)}
                    disabled={deleting}
                    className="text-red-400 hover:text-red-600 transition disabled:opacity-50"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes className="text-xl" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <FaUpload className="text-2xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-3">Upload Resume</h3>
              <p className="text-gray-500 text-sm">Upload your resume in PDF format</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume Title
              </label>
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                placeholder="e.g., Software Developer Resume"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PDF File
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FaFilePdf className="text-red-500 text-2xl" />
                    <div className="text-left">
                      <p className="font-medium text-gray-800">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div>
                    <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to browse or drag & drop</p>
                    <p className="text-xs text-gray-400 mt-1">PDF only • Max 5MB</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone. All analysis data and reports will be permanently removed."
        itemName={resumeToDelete?.title || ''}
        loading={deleting}
      />

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