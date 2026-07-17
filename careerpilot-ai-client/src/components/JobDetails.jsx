"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaStar,
  FaStarHalf,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";
import ResumeMatchWidget from "./ResumeMatchWidget";

const JobDetails = ({ job }) => {
  const [activeTab, setActiveTab] = useState("overview");

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
                    "https://via.placeholder.com/64/3b82f6/ffffff?text=" +
                    job.company[0];
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

          <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 whitespace-nowrap">
            Apply Now
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
          {/* Overview Tab */}
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

          {/* Company Tab */}
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

              {/* Company Images */}
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

          {/* Reviews Tab */}
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
    </div>
  );
};

export default JobDetails;
