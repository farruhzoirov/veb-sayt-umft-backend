
const Category = require('../../models/data/category.model');
const Direction = require('../../models/data/directions.model');
const Language = require('../../models/settings/language.model');


class StatisticController {
    async ModelCounts(req, res) {
        let language = await Language.countDocuments() || 0;
        let category = await Category.countDocuments() || 0;
        let direction = await Direction.countDocuments() || 0;
        res.status(200).json({
            language, direction, category
        });
    }
}

class Statistics {

}

module.exports = StatisticController;