"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaUpload,
  FaFilePdf,
  FaSpinner,
  FaCheckCircle,
  FaDownload,
  FaRobot,
  FaLightbulb,
  FaChartLine,
  FaClipboardList,
  FaTools,
  FaUserGraduate,
  FaCode,
  FaStar,
  FaFileAlt,
  FaEye,
  FaMagic,
  FaBrain,
  FaRocket,
  FaStarHalf,
  FaRegStar,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function AIDocumentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resumeId, setResumeId] = useState(null);

  // Redirect if not logged in
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (selectedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setUploadedFile(selectedFile);
    setAnalysis(null);

    // Auto-upload and analyze
    await handleUploadAndAnalyze(selectedFile);
  };

  const handleUploadAndAnalyze = async (selectedFile) => {
    setUploading(true);
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", selectedFile.name.replace(".pdf", ""));

      const uploadResponse = await fetch(
        "http://localhost:5000/api/resume/upload-ai",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: formData,
        },
      );

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await uploadResponse.json();
      if (data.resume?._id) {
        setResumeId(data.resume._id);
      }
      toast.success("Resume uploaded and analyzed by Gemini AI!");

      // Set analysis data
      if (data.analysis) {
        setAnalysis(data.analysis);
      } else if (data.resume?._id) {
        // If analysis is not included, fetch it
        const analyzeResponse = await fetch(
          "http://localhost:5000/api/resume/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
            body: JSON.stringify({ resumeId: data.resume._id }),
          },
        );
        const analyzeData = await analyzeResponse.json();
        setAnalysis(analyzeData.analysis);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };
  // Simulated AI Analysis (for demo without backend)
  const handleSimulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalysis({
        summary:
          "Senior Full Stack Developer with 5+ years of experience in React, Node.js, and cloud technologies. Strong background in building scalable web applications and leading technical teams.",
        skills: [
          { name: "React", level: 90 },
          { name: "Node.js", level: 85 },
          { name: "TypeScript", level: 80 },
          { name: "AWS", level: 75 },
          { name: "MongoDB", level: 70 },
          { name: "GraphQL", level: 65 },
        ],
        experience: [
          {
            title: "Senior Software Engineer",
            company: "TechCorp Inc.",
            duration: "2021 - Present",
            description:
              "Led development of microservices architecture serving 10M+ users.",
          },
          {
            title: "Full Stack Developer",
            company: "StartupX",
            duration: "2018 - 2021",
            description:
              "Built and maintained React applications with Node.js backend.",
          },
        ],
        education: [
          {
            degree: "M.S. Computer Science",
            institution: "Stanford University",
            year: "2018",
          },
        ],
        missingKeywords: [
          "Cloud Architecture",
          "Microservices",
          "Docker",
          "Kubernetes",
          "Redis",
        ],
        atsScore: 85,
        suggestions: [
          'Add more quantifiable achievements (e.g., "Increased performance by 40%")',
          "Include specific technologies with versions (React 18, Node.js 18)",
          "Add links to live projects or portfolio",
          "Highlight leadership and mentoring experience",
          "Include relevant certifications",
        ],
        overallScore: 82,
      });
      setAnalyzing(false);
      toast.success("AI Analysis complete!");
    }, 3000);
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
  // Loading state
  if (status === "loading") {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <div className="h-64 bg-gray-100 rounded-lg"></div>
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
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg shadow-purple-500/20">
            <FaRobot className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              AI Document Intelligence
            </h1>
            <p className="text-gray-600">
              Upload your resume for AI-powered analysis, scoring, and
              improvement suggestions
            </p>
          </div>
        </div>
      </div>

      {/* AI Features Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        <FeatureCard
          icon={<FaFileAlt className="text-blue-500" />}
          label="Extract Text"
          description="AI extracts all text from your PDF"
          color="blue"
        />
        <FeatureCard
          icon={<FaLightbulb className="text-yellow-500" />}
          label="Summarize"
          description="Get a professional summary"
          color="yellow"
        />
        <FeatureCard
          icon={<FaTools className="text-purple-500" />}
          label="Detect Skills"
          description="Identify your skills & experience"
          color="purple"
        />
        <FeatureCard
          icon={<FaChartLine className="text-green-500" />}
          label="ATS Score"
          description="Check resume compatibility"
          color="green"
        />
        <FeatureCard
          icon={<FaMagic className="text-pink-500" />}
          label="Missing Keywords"
          description="Find keywords to add"
          color="pink"
        />
        <FeatureCard
          icon={<FaDownload className="text-indigo-500" />}
          label="Download Report"
          description="Get detailed analysis report"
          color="indigo"
        />
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Upload Resume
            </h2>
            <p className="text-sm text-gray-500">
              Upload your PDF resume for AI analysis
            </p>
          </div>
          {uploadedFile && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <FaCheckCircle />
              Uploaded
            </span>
          )}
        </div>

        {/* Upload Area */}
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={uploading || analyzing}
          />
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              uploading || analyzing
                ? "border-gray-300 bg-gray-50"
                : "border-primary-300 hover:border-primary-500 hover:bg-primary-50"
            }`}
          >
            {uploading || analyzing ? (
              <div className="flex flex-col items-center">
                <FaSpinner className="text-4xl text-primary-600 animate-spin mb-3" />
                <p className="text-gray-600 font-medium">
                  {uploading
                    ? "Uploading your resume..."
                    : "AI is analyzing your resume..."}
                </p>
                <p className="text-sm text-gray-400">
                  {uploading ? "Please wait..." : "This may take a few moments"}
                </p>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center">
                <FaFilePdf className="text-4xl text-red-500 mb-3" />
                <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <FaCheckCircle />
                  Ready for analysis
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FaUpload className="text-4xl text-primary-400 mb-3" />
                <p className="text-gray-600 font-medium">
                  Drag & drop your resume here
                </p>
                <p className="text-sm text-gray-400">or click to browse</p>
                <p className="text-xs text-gray-400 mt-2">PDF only • Max 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {uploadedFile && !uploading && !analyzing && !analysis && (
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => {
                setFile(null);
                setUploadedFile(null);
                setAnalysis(null);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Change File
            </button>
            <button
              onClick={handleSimulateAnalysis}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
            >
              <FaBrain />
              Analyze Resume
            </button>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analyzing && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <div className="relative">
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div>
              <FaRobot className="absolute inset-0 m-auto text-3xl text-primary-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            AI is analyzing your resume...
          </h3>
          <p className="text-gray-500">
            Extracting text, detecting skills, and calculating ATS score
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
              Extracting text
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              Detecting skills
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-600"></div>
              Calculating score
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      {analysis && !analyzing && (
        <div className="space-y-6">
          {/* Score Overview */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800">
                      {analysis.overallScore}%
                    </span>
                    <span className="text-xs text-gray-500">Overall Score</span>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(analysis.overallScore)}
                  <span className="text-sm text-gray-500">
                    ({analysis.overallScore}/100)
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Resume Analysis Complete
                </h3>
                <p className="text-gray-600">{analysis.summary}</p>
              </div>

              <button
                onClick={handleDownloadReport}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 whitespace-nowrap"
              >
                <FaDownload />
                Download Report
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatBox
              label="ATS Score"
              value={`${analysis.atsScore}%`}
              color="green"
              progress={analysis.atsScore}
            />
            <StatBox
              label="Skills Detected"
              value={analysis.skills?.length || 0}
              color="blue"
            />
            <StatBox
              label="Experience"
              value={analysis.experience?.length || 0}
              color="purple"
            />
          </div>

          {/* Skills */}
          {analysis.skills && analysis.skills.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
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
              <h3 className="font-semibold text-gray-800 mb-4">
                💼 Experience
              </h3>
              <div className="space-y-4">
                {analysis.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-primary-500 pl-4"
                  >
                    <h4 className="font-medium text-gray-800">{exp.title}</h4>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <p className="text-xs text-gray-400">{exp.duration}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
            <div className="bg-yellow-50 rounded-xl shadow-md border border-yellow-200 p-6">
              <h3 className="font-semibold text-yellow-800 mb-3">
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
              <h3 className="font-semibold text-primary-800 mb-3">
                💡 Suggestions for Improvement
              </h3>
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-primary-700"
                  >
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
              <h3 className="font-semibold text-gray-800 mb-4">🎓 Education</h3>
              <div className="space-y-3">
                {analysis.education.map((edu, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                      {edu.institution?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {edu.degree}
                      </h4>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      <p className="text-xs text-gray-400">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper Components
const FeatureCard = ({ icon, label, description, color }) => {
  const colors = {
    blue: "bg-blue-50 border-blue-200",
    yellow: "bg-yellow-50 border-yellow-200",
    purple: "bg-purple-50 border-purple-200",
    green: "bg-green-50 border-green-200",
    pink: "bg-pink-50 border-pink-200",
    indigo: "bg-indigo-50 border-indigo-200",
  };

  return (
    <div
      className={`p-4 rounded-xl border ${colors[color] || "bg-gray-50 border-gray-200"} text-center hover:shadow-md transition`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <h4 className="font-semibold text-sm text-gray-800">{label}</h4>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </div>
  );
};

const StatBox = ({ label, value, color, progress }) => {
  const colors = {
    green: "text-green-600 bg-green-50",
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`text-2xl font-bold ${colors[color]?.split(" ")[0] || "text-gray-800"}`}
      >
        {value}
      </p>
      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div
            className="bg-green-500 h-1.5 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

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
