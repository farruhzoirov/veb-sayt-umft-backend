const { TranslateModel } = require("../common/constants/models.constants");
const { getModelsTranslateHelper } = require("./get-models.helper");
const BaseError = require("../errors/base.error");
const Language = require("../models/settings/language.model");

const getTranslations = async () => {};

const addTranslations = async (modelName, modelId, translationData) => {
  const forTranslateModel = TranslateModel[modelName]?.ref;

  const dynamicTranslateModel = getModelsTranslateHelper(forTranslateModel);

  const isModelTranslateEmpty = await dynamicTranslateModel.countDocuments();
  let newTranslationRecord;

  if (!isModelTranslateEmpty.length && !translationData.language) {
    const defaultLanguage = await Language.findOne({ isDefault: true });
    newTranslationRecord = new dynamicTranslateModel({
      [modelName]: modelId,
      language: defaultLanguage._id,
      ...translationData,
    });
    await newTranslationRecord.save();
    const addedTranslationObject = newTranslationRecord.toObject();
    delete addedTranslationObject.__v;
    return addedTranslationObject;
  }

  const isExistTranslation = await dynamicTranslateModel.findOne({
    [modelName]: modelId,
    language: translationData.language,
  });

  if (!isExistTranslation) {
    newTranslationRecord = await new dynamicTranslateModel({
      [modelName]: modelId,
      ...translationData,
    });
    await newTranslationRecord.save();
    const addedTranslationObject = newTranslationRecord.toObject();
    delete addedTranslationObject.__v;
    return addedTranslationObject;
  }

  throw BaseError.BadRequest("Translation already exists for this language");
};

const updateTranslations = async (modelName, modelId, translationData) => {
  let updatedData;
  const forTranslateModel = TranslateModel[modelName]?.ref;

  if (!forTranslateModel && !translationData.language) {
    throw BaseError.NotFound("Translation model or language not found");
  }

  const dynamicTranslateModel = getModelsTranslateHelper(forTranslateModel);
  const { language, ...translationFields } = translationData;

  const isExistTranslation = await dynamicTranslateModel.find({
    [modelName]: modelId,
    language: language,
  });

  if (!isExistTranslation.length) {
    const newData = await new dynamicTranslateModel({
      [modelName]: modelId,
      language: language,
      ...translationFields,
    });

    await newData.save();
    const allTranslationsData = await dynamicTranslateModel
      .find({ [modelName]: modelId })
      .select("-__v");
    return allTranslationsData;
  }

  updatedData = await dynamicTranslateModel.findOneAndUpdate(
    {
      [modelName]: modelId,
      language: language,
    },
    {
      $set: {
        ...translationFields,
      },
    },
    {
      new: true,
    }
  );
  const updatedTranslationObject = updatedData.toObject();
  delete updatedTranslationObject.__v;

  return [updatedTranslationObject];
};

module.exports = {
  addTranslations,
  updateTranslations,
};
