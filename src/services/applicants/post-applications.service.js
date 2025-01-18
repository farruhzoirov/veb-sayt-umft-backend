const Applicants = require('../../models//applicants/applicants.model');

class PostApplicationsService {
  async postApplications(req, res) {
    try {
      const application = req.body;
      const newApplication = new Applicants(application);
      await newApplication.save();
      return res.status(201).json({
        ok: true,
        message: 'Applications submitted successfully'
      });

    } catch (error) {
      console.error("Posting application", error);
      return res.status(500).json({
        ok: false,
        message: 'Failed to submit applications',
        error: error.message
      });
    }
  }
}


module.exports = PostApplicationsService;