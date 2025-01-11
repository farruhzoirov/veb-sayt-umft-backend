const Language = require('../../models/settings/language.model');

const getDefaultLanguageHelper = async () => {
  const defaultLanguage = await Language.findOne({isDefault: true}).lean();
  return defaultLanguage;
}

module.exports = getDefaultLanguageHelper;