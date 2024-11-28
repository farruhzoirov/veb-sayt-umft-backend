const { getPopulates } = require("./get-populates.helper");


const populateModelData = async (dynamicModel, modelId, populateFields) => {
    let newData = await dynamicModel.findById(modelId).lean();

    if (!newData) {
        throw new Error("No model with id '" + modelId + "'");
    }

    if(populateFields) {
        await Promise.all(
            populateFields.map(async (field) => {
                newData[field] = await getPopulates(field, newData[field]);
            })
        )
    }

    return newData;
}


module.exports = populateModelData;
