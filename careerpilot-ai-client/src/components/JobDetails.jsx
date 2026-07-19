"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FaStar,
  FaStarHalf,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaCheckCircle,
  FaSpinner,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";
import toast from "react-hot-toast";
import ResumeMatchWidget from "./ResumeMatchWidget";

const JobDetails = ({ job }) => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedResume, setSelectedResume] = useState("");
  const [userResumes, setUserResumes] = useState([]);

  if (!job) return null;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className="text-yellow-400" />);
    }
    return stars;
  };

  // Fetch user's resumes when modal opens
  const fetchUserResumes = async () => {
    if (!session) return;

    try {
      const response = await fetch("/api/resume", {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUserResumes(data.resumes || []);
        if (data.resumes?.length > 0) {
          setSelectedResume(data.resumes[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  const handleOpenApplyModal = () => {
    if (!session) {
      toast.error("Please login to apply for this job");
      return;
    }
    setShowApplyModal(true);
    fetchUserResumes();
    setApplicationStatus(null);
  };

  const handleCloseApplyModal = () => {
    setShowApplyModal(false);
    setCoverLetter("");
    setApplicationStatus(null);
  };

  const handleSubmitApplication = async () => {
    if (!selectedResume) {
      toast.error("Please select a resume");
      return;
    }

    setApplying(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In production, send to backend
      // const response = await fetch("/api/jobs/apply", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${session.user.token}`,
      //   },
      //   body: JSON.stringify({
      //     jobId: job.id,
      //     resumeId: selectedResume,
      //     coverLetter: coverLetter,
      //   }),
      // });

      setApplicationStatus("success");
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Application error:", error);
      setApplicationStatus("error");
      toast.error("Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Job Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.target.src =
                    "https://ui-avatars.com/api/?name=" +
                    job.company +
                    "&background=3b82f6&color=fff&size=64";
                }}
              />
            ) : (
              <span className="text-3xl font-bold text-primary-600">
                {job.company[0]}
              </span>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-xl text-gray-600">{job.company}</p>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <FaDollarSign /> {job.salary}
              </span>
              <span className="flex items-center gap-1">
                <FaClock /> {job.type}
              </span>
              <span className="flex items-center gap-1">
                <FaCalendarAlt /> Apply by {job.applyDeadline}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <span className="flex items-center gap-1 text-yellow-400">
                {renderStars(job.rating)}
              </span>
              <span className="text-sm text-gray-600">{job.rating} / 5</span>
            </div>
          </div>

          <button
            onClick={handleOpenApplyModal}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 whitespace-nowrap shadow-lg shadow-primary-600/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Apply Now
            <FaArrowRight className="text-sm" />
          </button>
        </div>
      </div>

      <ResumeMatchWidget job={job} />

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 p-4">
            {["overview", "company", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab - Same as before */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Responsibilities
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {job.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Requirements
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {job.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Benefits
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {job.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <span className="text-green-500">✓</span> {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Company Tab - Same as before */}
          {activeTab === "company" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                About {job.companyInfo.name}
              </h3>
              <p className="text-gray-600">{job.companyInfo.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Founded</p>
                  <p className="font-semibold">{job.companyInfo.founded}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Company Size</p>
                  <p className="font-semibold">{job.companyInfo.size}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Headquarters</p>
                  <p className="font-semibold">
                    {job.companyInfo.headquarters}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Website</p>
                  <a
                    href={job.companyInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline font-semibold"
                  >
                    {job.companyInfo.website}
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">Company Images</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.companyImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-48 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`${job.company} office ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab - Same as before */}
          {activeTab === "reviews" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Reviews</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary-600">
                    {job.rating}
                  </span>
                  <span className="text-yellow-400 flex">
                    {renderStars(job.rating)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {job.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.user}
                        </p>
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== APPLY MODAL ========== */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseApplyModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseApplyModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Success State */}
            {applicationStatus === "success" ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-4xl text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Application Submitted! 🎉
                </h3>
                <p className="text-gray-600 mb-2">
                  You have successfully applied for{" "}
                  <strong>{job.title}</strong> at {job.company}.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  The company will review your application and get back to you
                  soon.
                </p>
                <button
                  onClick={handleCloseApplyModal}
                  className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <FaBuilding className="text-2xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mt-3">
                    Apply for {job.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {job.company} • {job.location}
                  </p>
                </div>

                {/* Application Form */}
                <div className="space-y-4">
                  {/* Select Resume */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Resume *
                    </label>
                    {userResumes.length === 0 ? (
                      <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-700 mb-2">
                          No resumes found. Please upload a resume first.
                        </p>
                        <Link
                          href="/resume"
                          className="text-sm text-primary-600 hover:underline font-medium"
                        >
                          Upload Resume →
                        </Link>
                      </div>
                    ) : (
                      <select
                        value={selectedResume}
                        onChange={(e) => setSelectedResume(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {userResumes.map((resume) => (
                          <option key={resume._id} value={resume._id}>
                            {resume.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows="4"
                      placeholder="Write a brief cover letter explaining why you're a good fit for this position..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>

                  {/* Job Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Position:</span>{" "}
                      {job.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Company:</span>{" "}
                      {job.company}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Location:</span>{" "}
                      {job.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Salary:</span> {job.salary}
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleCloseApplyModal}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitApplication}
                      disabled={applying || userResumes.length === 0}
                      className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {applying ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Animation */}
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
};

export default JobDetails;