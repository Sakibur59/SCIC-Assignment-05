const Resume = require('../models/Resume');
const SavedJob = require('../models/SavedJob');

// @desc    Get real dashboard stats for the logged-in user
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [resumes, savedJobs] = await Promise.all([
      Resume.findByUserId(userId),
      SavedJob.findByUserId(userId),
    ]);

    const latest = resumes[0] || null;

    const savedJobsByStatus = savedJobs.reduce((acc, job) => {
      const status = job.status || 'saved';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      resumeCount: resumes.length,
      latestResume: latest
        ? {
            _id: latest._id,
            title: latest.title,
            score: latest.analysis?.score ?? null,
            atsScore: latest.analysis?.atsScore ?? null,
            skillsCount: latest.analysis?.keywords?.length ?? 0,
            missingKeywordsCount: latest.analysis?.missingKeywords?.length ?? 0,
            analyzedAt: latest.analysis?.analyzedAt ?? null,
          }
        : null,
      savedJobsCount: savedJobs.length,
      savedJobsByStatus,
      recentSavedJobs: savedJobs.slice(0, 5).map((j) => ({
        _id: j._id,
        title: j.jobData?.title,
        company: j.jobData?.company,
        status: j.status || 'saved',
        createdAt: j.createdAt,
      })),
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats };