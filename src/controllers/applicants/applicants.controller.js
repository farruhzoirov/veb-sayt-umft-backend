const PostApplicantsService = require('../../services/applicants/post-applications.service')
const GetApplicantsService = require('../../services/applicants/get-applicants.service');
const GetOneApplicantService = require('../../services/applicants/get-applicant.service');

class ApplicantsController {
    constructor() {
        this.postApplicantsService = new PostApplicantsService();
        this.getApplicantsService = new GetApplicantsService();
        this.getOneApplicantService = new GetOneApplicantService();

        // Bind
        this.post = this.post.bind(this);
        this.getAllApplicants = this.getAllApplicants.bind(this);
        this.getOneApplicantById = this.getOneApplicantById.bind(this);
    }

    async post(req, res) {
        await this.postApplicantsService.postApplications(req, res);
    }

    async getAllApplicants(req, res) {
        await this.getApplicantsService.getApplicants(req, res);
    }

    async getOneApplicantById(req, res) {
        await this.getOneApplicantService.getOneApplicantById(req, res);
    }
}






module.exports = ApplicantsController;