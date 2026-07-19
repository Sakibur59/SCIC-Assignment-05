const Resume = require("../models/Resume");
const {
  analyzeResumeWithGemini,
  matchResumeToJob,
} = require("../services/geminiService");
const fs = require("fs");
const path = require("path");
const { getDb } = require("../config/database");
const { extractTextFromPDF } = require("../services/pdfExtractor");
const { generateResumeReportPDF } = require("../services/reportGenerator");

// @desc    Upload resume (regular)
// @route   POST /api/resume
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const { title, skills, experience, portfolio, linkedin, github } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please provide a title" });
    }

    const resumeData = {
      userId: req.user._id,
      title,
      fileName: req.file.filename,
      filePath: `/uploads/resumes/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      skills: skills ? JSON.parse(skills) : [],
      experience: experience ? JSON.parse(experience) : [],
      portfolio: portfolio || "",
      linkedin: linkedin || "",
      github: github || "",
    };

    const resume = await Resume.create(resumeData);

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Upload resume with Gemini extraction
// @route   POST /api/resume/upload-ai
// @access  Private
const uploadResumeWithGemini = async (req, res) => {
  try {
    console.log("📤 Uploading resume with Gemini...");
    console.log("📋 File:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please provide a title" });
    }

    // Extract text from PDF
    const filePath = path.join(
      process.cwd(),
      "uploads",
      "resumes",
      req.file.filename,
    );
    console.log("📁 File path:", filePath);

    let extractedText = "";

    try {
      extractedText = await extractTextFromPDF(filePath);
      console.log("📄 Extracted text length:", extractedText.length);
    } catch (error) {
      console.error("❌ PDF extraction failed:", error);
      extractedText = `Resume: ${title}. File: ${req.file.filename}.`;
    }

    if (extractedText.length < 50) {
      extractedText = `Resume: ${title}. File: ${req.file.filename}.`;
    }

    // Create resume
    const resumeData = {
      userId: req.user._id,
      title,
      fileName: req.file.filename,
      filePath: `/uploads/resumes/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      extractedText: extractedText,
      skills: [],
      experience: [],
      education: [],
    };

    const resume = await Resume.create(resumeData);
    console.log("✅ Resume saved to database:", resume._id);

    // Analyze with Gemini
    let analysis;
    try {
      analysis = await analyzeResumeWithGemini(extractedText);
      console.log("✅ Gemini analysis completed");
    } catch (error) {
      console.error("❌ Gemini analysis failed:", error);
      
      // 👇 Return error response with proper message
      const errorMessage = error.message || "Analysis failed";
      let userMessage = "AI analysis failed. Please try again.";
      
      if (errorMessage.includes("quota") || errorMessage.includes("429")) {
        userMessage = "🚨 Gemini API quota exceeded. Please try again after 24 hours.";
      } else if (errorMessage.includes("503")) {
        userMessage = "⚠️ AI service is busy. Please try again in a few minutes.";
      }
      
      // Save resume without analysis
      return res.status(429).json({
        message: userMessage,
        resume: resume,
        analysis: null,
        error: true
      });
    }

    // Save analysis
    const finalAnalysis = {
      summary: analysis.summary || "",
      skills: analysis.skills || [],
      experience: analysis.experience || [],
      education: analysis.education || [],
      missingKeywords: analysis.missingKeywords || [],
      atsScore: analysis.atsScore || 0,
      suggestions: analysis.suggestions || [],
      overallScore: analysis.overallScore || 0,
      keywords: analysis.skills?.map((s) => s.name) || [],
      analyzedAt: new Date(),
    };

    await Resume.updateAnalysis(resume._id, finalAnalysis);

    res.status(201).json({
      message: "Resume uploaded and analyzed successfully",
      resume,
      analysis: finalAnalysis,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};
// @desc    Get all resumes
// @route   GET /api/resume
// @access  Private
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.findByUserId(req.user._id);
    res.json({ resumes });
  } catch (error) {
    console.error("Get resumes error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single resume
// @route   GET /api/resume/:id
// @access  Private
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUser(req.params.id, req.user._id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ resume });
  } catch (error) {
    console.error("Get resume error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update resume
// @route   PUT /api/resume/:id
// @access  Private
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUser(req.params.id, req.user._id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const allowedFields = [
      "title",
      "skills",
      "experience",
      "portfolio",
      "linkedin",
      "github",
    ];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await Resume.update(req.params.id, updates);
    const updatedResume = await Resume.findById(req.params.id);

    res.json({
      message: "Resume updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    console.error("Update resume error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUser(req.params.id, req.user._id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Delete file
    const filePath = path.join(
      process.cwd(),
      "uploads",
      "resumes",
      resume.fileName,
    );
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("File deletion error:", error);
    }

    await Resume.delete(req.params.id);

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Analyze resume with Gemini AI
// @route   POST /api/resume/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.body;

    console.log("🔍 Analyzing resume with Gemini AI:", resumeId);

    const resume = await Resume.findByIdAndUser(resumeId, req.user._id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Build text from resume data for analysis
    let resumeText =
      resume.extractedText && resume.extractedText.trim().length > 50
        ? resume.extractedText
        : buildResumeText(resume);

    console.log("📄 Extracted text length:", resumeText.length);

    // Analyze with Gemini AI
    const analysis = await analyzeResumeWithGemini(resumeText);

    // Add user's existing skills and experience to analysis
    if (resume.skills?.length > 0) {
      const existingSkills = resume.skills.map((s) => ({ name: s, level: 80 }));
      const allSkills = [...existingSkills, ...(analysis.skills || [])];
      const uniqueSkills = allSkills.filter(
        (skill, index, self) =>
          index ===
          self.findIndex(
            (s) => s.name.toLowerCase() === skill.name.toLowerCase(),
          ),
      );
      analysis.skills = uniqueSkills.slice(0, 10);
    }

    // Calculate overall score
    const atsScore = analysis.atsScore || 75;
    const skillScore = Math.min(100, (analysis.skills?.length || 0) * 6 + 40);
    const expScore = Math.min(
      100,
      (analysis.experience?.length || 0) * 15 + 30,
    );
    const overallScore = Math.round(
      atsScore * 0.4 + skillScore * 0.3 + expScore * 0.3,
    );

    // Ensure all required fields exist
    const finalAnalysis = {
      summary:
        analysis.summary ||
        "Professional resume with strong skills and experience.",
      skills: analysis.skills || [],
      experience: analysis.experience || [],
      education: analysis.education || [],
      missingKeywords: analysis.missingKeywords || [
        "Cloud Architecture",
        "Microservices",
        "Docker",
      ],
      atsScore: atsScore,
      suggestions: analysis.suggestions || [
        'Add more quantifiable achievements (e.g., "Increased performance by 40%")',
        "Include specific technologies with versions",
        "Highlight leadership and mentoring experience",
      ],
      overallScore: overallScore,
      keywords: analysis.skills?.map((s) => s.name) || [],
      analyzedAt: new Date(),
    };

    // Save analysis to database
    await Resume.updateAnalysis(resumeId, finalAnalysis);

    console.log("✅ Analysis completed with Gemini AI");

    res.json({
      message: "Analysis completed successfully",
      analysis: finalAnalysis,
    });
  } catch (error) {
    console.error("❌ Analysis error:", error);
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

// Helper: Build text from resume data
const buildResumeText = (resume) => {
  const parts = [];

  if (resume.title) parts.push(`Resume Title: ${resume.title}`);
  if (resume.skills?.length) parts.push(`Skills: ${resume.skills.join(", ")}`);

  if (resume.experience?.length) {
    resume.experience.forEach((exp) => {
      parts.push(
        `Experience: ${exp.title} at ${exp.company} (${exp.from} - ${exp.to || "Present"})`,
      );
      if (exp.description) parts.push(`Description: ${exp.description}`);
    });
  }

  if (resume.education?.length) {
    resume.education.forEach((edu) => {
      parts.push(
        `Education: ${edu.degree} from ${edu.institution} (${edu.year})`,
      );
    });
  }

  if (resume.portfolio) parts.push(`Portfolio: ${resume.portfolio}`);
  if (resume.linkedin) parts.push(`LinkedIn: ${resume.linkedin}`);
  if (resume.github) parts.push(`GitHub: ${resume.github}`);

  return parts.join("\n") || "No resume data available for analysis.";
};

// @desc    Match a resume against a specific job posting
// @route   POST /api/resume/match-job
// @access  Private
const matchJob = async (req, res) => {
  try {
    const { resumeId, jobText } = req.body;

    if (!resumeId || !jobText) {
      return res
        .status(400)
        .json({ message: "resumeId and jobText are required" });
    }

    const resume = await Resume.findByIdAndUser(resumeId, req.user._id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Prefer previously-extracted text (saved during AI upload); otherwise
    // fall back to re-extracting from the stored PDF file.
    let resumeText = resume.extractedText;

    if (!resumeText || resumeText.trim().length < 50) {
      const filePath = path.join(
        process.cwd(),
        "uploads",
        "resumes",
        resume.fileName,
      );
      resumeText = await extractTextFromPDF(filePath);
    }

    const matchResult = await matchResumeToJob(resumeText, jobText);

    res.json({
      message: "Job match completed",
      match: matchResult,
    });
  } catch (error) {
    console.error("❌ Job match error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Download a PDF report of a resume's AI analysis
// @route   GET /api/resume/:id/report
// @access  Private
const downloadReport = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUser(req.params.id, req.user._id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const hasAnalysis =
      resume.analysis &&
      (resume.analysis.score || resume.analysis.overallScore);
    if (!hasAnalysis) {
      return res
        .status(400)
        .json({ message: "This resume has not been analyzed yet" });
    }

    console.log("📊 Report data check for resume:", resume._id.toString());
    console.log("   Skills:", resume.analysis?.skills?.length || 0);
    console.log("   Experience:", resume.analysis?.experience?.length || 0);
    console.log("   Education:", resume.analysis?.education?.length || 0);
    console.log("   AnalyzedAt:", resume.analysis?.analyzedAt);

    generateResumeReportPDF(resume, resume.analysis, res);
  } catch (error) {
    console.error("❌ Report generation error:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};

module.exports = {
  uploadResume,
  uploadResumeWithGemini,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  analyzeResume,
  matchJob,
  downloadReport,
};
