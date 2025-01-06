const GetClassifiersService  = require("../../services/hemis/classifiers/get-classifiers.service");

class ClassifiersController {
    constructor() {
        // Services
        this.getClassifiersService = new GetClassifiersService();

        // Bind
        this.getClassifiers = this.getClassifiers.bind(this);
    }

    async getClassifiers(req, res, next) {
        try {
            const classifier = req.params.classifier;
            const filteredClassifiersData = await this.getClassifiersService.getClassifier(classifier);
            res.status(200).json({
                data: filteredClassifiersData,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ClassifiersController;