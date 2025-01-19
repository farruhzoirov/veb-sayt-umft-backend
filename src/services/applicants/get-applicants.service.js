const Applicants = require('../../models//applicants/applicants.model');
const mongoose = require("mongoose");

class GetApplicantsService {
  async getApplicants(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const select = req.query.select ? req.query.select.split(',') : [];
      const search = req.query.search ? JSON.parse(req.query.search) : {};

      const skip = (page - 1) * limit;

      const searchQuery = {};

      if (search.name) {
        searchQuery.name = {$regex: search.name, $options: 'i'};
      }

      if (search.email) {
        searchQuery.email = {$regex: search.email, $options: 'i'};
      }

      if (search.phone) {
        searchQuery.phone = {$regex: search.phone, $options: 'i'};
      }

      let applicants;
      applicants = await Applicants.find(searchQuery)
          .sort({_id: -1})
          .select(select.length > 0 ? select.join(' ') : "slug name email phone")
          .limit(limit)
          .skip(skip)
          .lean();
      const count = await Applicants.countDocuments();
      return res.status(200).json({
        ok: true,
        data: applicants,
        count: count,
        page: Number(page),
        limit: Number(limit)
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

module.exports = GetApplicantsService;