const Applicants = require('../../models//applicants/applicants.model');
const mongoose = require("mongoose");

class GetApplicantsService {
    async getApplicants(req, res) {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 20;
            const select = req.query.select || [];
            const skip = (page - 1) * limit;
            const applicantId = req.body.applicantId;
            let applicants;
            if (!applicantId) {
                applicants = await Applicants.find()
                    .select(select)
                    .limit(limit)
                    .skip(skip)
                    .lean();
                return res.status(200).json({
                    ok: false,
                    data: applicants,
                });
            }
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
            }).lean();
            return res.status(200).json({
                ok: false,
                data: applicants,
            });
        } catch (error) {
            res.status(500).send({
                ok: false,
                message: error.message
            })
        }
    }
}

module.exports = GetApplicantsService;