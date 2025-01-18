const Applicants = require('../../models//applicants/applicants.model');
const mongoose = require("mongoose");

class GetOneApplicantService {
  async getOneApplicantById(req, res) {
    try {
      let applicantId = req.params.applicantId;
      if (!applicantId) {
        return res.status(400).json({
          ok: false,
          message: "ApplicantId is required."
        })
      }
      let applicants;
      if (!mongoose.Types.ObjectId.isValid(applicantId)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid applicantId"
        })
      }
      applicants = await Applicants.findOne({_id: applicantId}).select(select ? select : {
        slug: 1,
        name: 1,
        email: 1,
        phone: 1
      }).lean() || [];
      return res.status(200).json({
        ok: true,
        data: applicants,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        ok: false,
        message: error.message
      })
    }
  }
}

module.exports = GetOneApplicantService;