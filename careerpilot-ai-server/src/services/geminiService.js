const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
let genAI;

try {
  if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
} catch (error) {
  console.error("❌ Failed to initialize Gemini:", error);
}

// Retries a Gemini call with exponential backoff on transient 503 errors
const callWithRetry = async (fn, maxRetries = 3) => {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const is503 = error.message?.includes("503") || error.status === 503;
      if (!is503 || attempt === maxRetries) throw error;

      const waitMs = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
      console.log(
        `⏳ Gemini busy (503), retrying in ${waitMs}ms... (attempt ${attempt}/${maxRetries})`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  throw lastError;
};

const analyzeResumeWithGemini = async (resumeText) => {
  try {
    if (!API_KEY || !genAI) {
      throw new Error("Gemini API key not configured");
    }

    console.log("🤖 Analyzing resume with Gemini...");
    console.log("📄 Text length:", resumeText?.length || 0);

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-flash-latest",
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 1,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
    You are an expert resume analyzer. Extract ALL information from this resume text.
    
    RESUME TEXT:
    ${resumeText || "No text provided"}

    Return ONLY valid JSON with this structure. Extract REAL data from the resume.
    If something is not found, use empty array or null.

    {
      "personalInfo": {
        "name": "Extracted name or null",
        "email": "Extracted email or null",
        "phone": "Extracted phone or null",
        "location": "Extracted location or null",
        "linkedin": "Extracted LinkedIn URL or null",
        "github": "Extracted GitHub URL or null"
      },
      "summary": "Extracted career objective or summary",
      "skills": [
        {"name": "Skill from resume", "level": 0}
      ],
      "experience": [
        {
          "title": "Job title from resume",
          "company": "Company name from resume",
          "duration": "Duration from resume",
          "description": "Description from resume"
        }
      ],
      "education": [
        {
          "degree": "Degree from resume",
          "institution": "Institution from resume",
          "year": "Year from resume"
        }
      ],
      "projects": [
        {
          "name": "Project name",
          "description": "Project description",
          "technologies": ["Tech1", "Tech2"]
        }
      ],
      "certifications": ["Cert1", "Cert2"],
      "languages": ["Lang1", "Lang2"]
    }

    IMPORTANT: Extract ONLY what is actually in the resume. Do not make up data.
    Return ONLY valid JSON, no other text.
    `;

    const result = await callWithRetry(() => model.generateContent(prompt));
    const response = await result.response;
    const text = response.text();

    // Parse JSON
    let analysisData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        analysisData = JSON.parse(text);
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("Failed to parse Gemini response");
    }

    // Calculate scores based on extracted data
    const scores = calculateScores(analysisData);

    return {
      ...analysisData,
      atsScore: scores.atsScore,
      overallScore: scores.overallScore,
      missingKeywords: scores.missingKeywords,
      suggestions: scores.suggestions,
    };
  } catch (error) {
    console.error("❌ Gemini Error:", error);
    // Throw error instead of returning fallback
    throw new Error("Analysis failed: " + error.message);
  }
};

// Calculate scores based on extracted data - DYNAMIC
const calculateScores = (data) => {
  let atsScore = 20; // Start from 20, not 60
  const suggestions = [];
  const missingKeywords = [];

  // 1. Check Personal Info (max 15 points)
  if (data.personalInfo?.email) atsScore += 5;
  else suggestions.push("Add email address");

  if (data.personalInfo?.phone) atsScore += 5;
  else suggestions.push("Add phone number");

  if (data.personalInfo?.linkedin) atsScore += 5;
  else suggestions.push("Add LinkedIn profile URL");

  // 2. Check Summary (max 10 points)
  if (data.summary && data.summary.length > 30) {
    atsScore += 10;
  } else if (data.summary && data.summary.length > 10) {
    atsScore += 5;
  } else {
    suggestions.push("Add a strong career objective or professional summary");
  }

  // 3. Check Skills (max 25 points)
  if (data.skills && data.skills.length >= 10) {
    atsScore += 25;
  } else if (data.skills && data.skills.length >= 7) {
    atsScore += 20;
  } else if (data.skills && data.skills.length >= 5) {
    atsScore += 15;
  } else if (data.skills && data.skills.length >= 3) {
    atsScore += 10;
  } else {
    suggestions.push("Add more technical skills (aim for 8-10 skills)");
  }

  // 4. Check Experience (max 25 points)
  if (data.experience && data.experience.length >= 3) {
    atsScore += 25;
  } else if (data.experience && data.experience.length >= 2) {
    atsScore += 18;
  } else if (data.experience && data.experience.length >= 1) {
    atsScore += 10;
    suggestions.push("Add more work experience details");
  } else {
    suggestions.push("Add work experience to your resume");
  }

  // Check experience descriptions
  if (data.experience) {
    data.experience.forEach((exp) => {
      if (exp.description && exp.description.length > 50) {
        atsScore += 2;
      } else {
        suggestions.push(
          `Add detailed description for "${exp.title}" experience`,
        );
      }
    });
  }

  // 5. Check Education (max 15 points)
  if (data.education && data.education.length >= 2) {
    atsScore += 15;
  } else if (data.education && data.education.length >= 1) {
    atsScore += 10;
    suggestions.push("Add more education details");
  } else {
    suggestions.push("Add education details to your resume");
  }

  // 6. Check Projects (max 10 points)
  if (data.projects && data.projects.length >= 3) {
    atsScore += 10;
  } else if (data.projects && data.projects.length >= 2) {
    atsScore += 7;
  } else if (data.projects && data.projects.length >= 1) {
    atsScore += 4;
    suggestions.push("Add more projects to showcase your skills");
  } else {
    suggestions.push("Add projects to demonstrate your practical skills");
  }

  // 7. Detect missing keywords
  const commonKeywords = [
    "React",
    "Node.js",
    "JavaScript",
    "HTML",
    "CSS",
    "MongoDB",
    "Express",
    "API",
    "REST",
    "Database",
    "Git",
    "GitHub",
    "TypeScript",
    "Next.js",
    "Tailwind",
    "Bootstrap",
    "JWT",
    "Authentication",
    "Authorization",
    "Deployment",
    "AWS",
  ];

  const text = JSON.stringify(data).toLowerCase();
  commonKeywords.forEach((keyword) => {
    if (!text.includes(keyword.toLowerCase())) {
      missingKeywords.push(keyword);
    }
  });

  // Cap scores
  atsScore = Math.min(98, atsScore);
  const overallScore = Math.min(
    98,
    atsScore - Math.floor(missingKeywords.length / 3),
  );

  // Limit suggestions
  const finalSuggestions = suggestions.slice(0, 7);
  if (missingKeywords.length > 0) {
    finalSuggestions.push(
      `Add these keywords to improve ATS score: ${missingKeywords.slice(0, 4).join(", ")}`,
    );
  }

  return {
    atsScore,
    overallScore,
    missingKeywords: missingKeywords.slice(0, 7),
    suggestions: finalSuggestions,
  };
};

// Compare a resume against a specific job posting and return a tailored match report
const matchResumeToJob = async (resumeText, jobText) => {
  try {
    if (!API_KEY || !genAI) {
      throw new Error("Gemini API key not configured");
    }

    console.log("🎯 Matching resume against job posting...");

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-flash-latest",
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
You are an expert recruiter and ATS system. Compare the CANDIDATE RESUME
against the JOB POSTING below, and return ONLY valid JSON in exactly this
shape (no markdown, no extra text):

{
  "matchScore": 0-100 integer (how well the resume fits this specific job),
  "verdict": "one short sentence overall verdict",
  "matchingSkills": ["skills/requirements from the job that the resume DOES cover"],
  "missingSkills": ["skills/requirements from the job that the resume DOES NOT cover"],
  "strengths": ["2-4 specific strengths of this candidate for this specific role"],
  "gaps": ["2-4 specific gaps/weaknesses relative to this specific role"],
  "tailoredSuggestions": ["3-5 concrete suggestions to tailor this resume for this exact job posting"]
}

Base everything strictly on the text given. Do not invent facts about the candidate.

CANDIDATE RESUME:
"""
${resumeText}
"""

JOB POSTING:
"""
${jobText}
"""
`;

    const result = await callWithRetry(() => model.generateContent(prompt));
    const rawText = result.response.text();
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON Parse Error (job match):", err);
      throw new Error("Failed to parse Gemini job-match response");
    }

    return parsed;
  } catch (error) {
    console.error("❌ Job match error:", error);
    throw new Error("Job match failed: " + error.message);
  }
};

module.exports = { analyzeResumeWithGemini, matchResumeToJob };
