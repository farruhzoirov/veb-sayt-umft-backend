const PostApplicantsService = require('../../services/applicants/post-applications.service')
const GetApplicantsService = require('../../services/applicants/get-applicants.service')

class ApplicantsController {
    constructor() {
        this.postApplicantsService = new PostApplicantsService();
        this.getApplicantsService = new GetApplicantsService();

        // Bind
        this.post = this.post.bind(this);
        this.get = this.get.bind(this);
    }

    async post(req, res) {
        await this.postApplicantsService.postApplications(req, res);
    }

    async get(req, res) {
        await this.getApplicantsService.getApplicants(req, res);
    }
}






module.exports = ApplicantsController;