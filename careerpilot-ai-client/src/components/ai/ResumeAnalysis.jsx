'use client';

import { FaDownload, FaStar, FaStarHalf, FaRegStar } from 'react-icons/fa';

const ResumeAnalysis = ({ analysis }) => {
  if (!analysis) return null;

  const renderStars = (score) => {
    const stars = [];
    const filledStars = Math.floor(score / 20);
    const hasHalf = (score % 20) >= 10;

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

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{analysis.overallScore}%</span>
                <span className="text-xs text-gray-500">Overall Score</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {renderStars(analysis.overallScore)}
              <span className="text-sm text-gray-500">({analysis.overallScore}/100)</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Resume Analysis</h3>
            <p className="text-gray-600">{analysis.summary}</p>
          </div>

          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 whitespace-nowrap">
            <FaDownload />
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 text-center">
          <p className="text-sm text-gray-500">ATS Score</p>
          <p className="text-2xl font-bold text-gray-800">{analysis.atsScore}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${analysis.atsScore}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 text-center">
          <p className="text-sm text-gray-500">Skills Detected</p>
          <p className="text-2xl font-bold text-gray-800">{analysis.skills?.length || 0}</p>
          <p className="text-xs text-gray-400">Total skills found</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 text-center">
          <p className="text-sm text-gray-500">Experience</p>
          <p className="text-2xl font-bold text-gray-800">{analysis.experience?.length || 0}</p>
          <p className="text-xs text-gray-400">Years of experience</p>
        </div>
      </div>

      {/* Skills */}
      {analysis.skills && analysis.skills.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Skills Detected</h3>
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
          <h3 className="font-semibold text-gray-800 mb-4">Experience</h3>
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

      {/* Missing Keywords */}
      {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
        <div className="bg-yellow-50 rounded-xl shadow-md border border-yellow-200 p-6">
          <h3 className="font-semibold text-yellow-800 mb-3">Missing Keywords</h3>
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
            Add these keywords to improve your ATS score
          </p>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="bg-primary-50 rounded-xl shadow-md border border-primary-200 p-6">
          <h3 className="font-semibold text-primary-800 mb-3">💡 Suggestions for Improvement</h3>
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

      {/* Education */}
      {analysis.education && analysis.education.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Education</h3>
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
    </div>
  );
};

export default ResumeAnalysis;