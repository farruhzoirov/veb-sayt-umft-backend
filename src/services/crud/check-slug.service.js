const {getModelsHelper} = require("../../helpers/get-models.helper");

class CheckIsSlugExistsService {
    async checkIsSlugExists(model,slug) {
        const dynamicModel = await getModelsHelper(model);
        const isSlugExists = await dynamicModel.find({slug: slug}).lean();
        if (!isSlugExists) {
            return 0;
        }
        return 1;
    }
}

module.exports = CheckIsSlugExistsService;