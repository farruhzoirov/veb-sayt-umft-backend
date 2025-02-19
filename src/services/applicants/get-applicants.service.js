const Applicants = require('../../models//applicants/applicants.model');

class GetApplicantsService {
  async getApplicants(req, res) {
    try {
      const page = parseInt(req.query?.page) || 1;
      const limit = parseInt(req.query?.limit) || 20;
      const select = req.query?.select ? req.query?.select.split(',') : '';
      const search = req.query?.search;
      const skip = (page - 1) * limit;
      const searchQuery = {};

      if (search) {
        searchQuery.name = {$regex: search, $options: 'i'};
      }

      let applicants;
      applicants = await Applicants.find(searchQuery)
          .sort({_id: -1})
          .select(select)
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