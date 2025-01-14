const GetClassifiersService  = require("../../../../services/admin-panel/hemis/classifiers/get-classifiers.service");

class ClassifiersController {
    constructor() {
        // Services
        this.getClassifiersService = new GetClassifiersService();

        // Bind
        this.getClassifiers = this.getClassifiers.bind(this);
    }

    async getClassifiers(req, res, next) {
        try {
            const filteredClassifiersData = await this.getClassifiersService.getClassifier(req);
            res.status(200).json({
                data: filteredClassifiersData,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ClassifiersController;