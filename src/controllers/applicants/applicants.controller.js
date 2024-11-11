const ApplicantsService = require('../../services/applicants/post-applications.service')

class ApplicantsController {
    constructor() {
        this.applicantsService = new ApplicantsService();

        this.post = this.post.bind(this);
    }

    async post(req, res) {
        await this.applicantsService.postApplications(req, res);
    }
}


module.exports = ApplicantsController;