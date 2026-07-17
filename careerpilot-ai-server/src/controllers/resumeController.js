const Resume = require('../models/Resume');
const fs = require('fs');
const path = require('path');

// @desc    Upload resume
// @route   POST /api/resume
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const { title, skills, experience, portfolio, linkedin, github } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Please provide a title' });
    }

    const resumeData = {
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: `/uploads/resumes/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      skills: skills ? JSON.parse(skills) : [],
      experience: experience ? JSON.parse(experience) : [],
      portfolio: portfolio || '',
      linkedin: linkedin || '',
      github: github || '',
    };

    const resume = await Resume.create(resumeData);

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume,
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ message: 'Server error' });
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
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single resume
// @route   GET /api/resume/:id
// @access  Private
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUser(req.params.id, req.user._id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ resume });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update resume
// @route   PUT /api/resume/:id
// @access  Private
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUser(req.params.id, req.user._id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const allowedFields = ['title', 'skills', 'experience', 'portfolio', 'linkedin', 'github'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await Resume.update(req.params.id, updates);
    const updatedResume = await Resume.findById(req.params.id);

    res.json({
      message: 'Resume updated successfully',
      resume: updatedResume,
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUser(req.params.id, req.user._id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Delete file
    const filePath = path.join(__dirname, '../../', resume.filePath);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('File deletion error:', error);
    }

    await Resume.delete(req.params.id);

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Analyze resume
// @route   POST /api/resume/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.body;
    
    const resume = await Resume.findByIdAndUser(resumeId, req.user._id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Simulate AI analysis
    const analysis = {
      score: Math.floor(Math.random() * 30) + 70,
      atsScore: Math.floor(Math.random() * 30) + 60,
      keywords: ['React', 'Node.js', 'JavaScript', 'AWS', 'MongoDB'],
      suggestions: [
        'Add more quantifiable achievements',
        'Include relevant certifications',
        'Optimize for ATS with more keywords',
        'Improve formatting for better readability',
      ],
    };

    await Resume.updateAnalysis(resumeId, analysis);

    res.json({
      message: 'Analysis completed',
      analysis,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  uploadResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  analyzeResume,
};