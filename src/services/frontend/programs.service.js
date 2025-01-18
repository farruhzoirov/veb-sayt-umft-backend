const Specialty = require("../../models/specialty/specialty.model");
const SpecialtyTranslate = require("../../models/translate/specialty.model");
const Language = require("../../models/settings/language.model");
const mongoose = require("mongoose");
const BaseError = require("../../errors/base.error");
const {Model} = require("../../common/constants/models.constants");
const {getPopulates} = require("../../helpers/admin-panel/get-populates.helper");

class ProgramsService {
  constructor() {
    this.Model = Model
  }

  async filterAndGetPrograms(req) {
    const defaultLanguage = await Language.findOne({isDefault: true});
    const payload = {
      format: req.body?.format || null,
      degree: req.body?.degree || null,
      department: req.body?.department || null,
    }

    const queryParameters = {
      requestedLanguage: req.query?.language || defaultLanguage.slug,
      selectFields: req.query?.select || ''
    }

    const selectedLanguage = await Language.findOne({
      slug: queryParameters.requestedLanguage,
    }).lean();

    if (!selectedLanguage) {
      throw BaseError.BadRequest("Language doesn't exists which matches to this slug");
    }

    let programsList;

    // Validate ObjectId parameters
    const invalidId =
        (payload.department && !mongoose.Types.ObjectId.isValid(payload.department)) ||
        (payload.degree && !mongoose.Types.ObjectId.isValid(payload.degree)) ||
        (payload.format && !mongoose.Types.ObjectId.isValid(payload.format));

    if (invalidId) {
      throw BaseError.BadRequest("One of these IDs is not valid");
    }

    const query = {};
    if (payload.department) query.department = payload.department;
    if (payload.degree) query.degree = payload.degree;
    if (payload.format) query["prices.format"] = payload.format;

    programsList = await Specialty.find(query).lean();
    const populateOptions = this.Model.specialty.populate || [];

    if (programsList.length) {
      programsList = await Promise.all(
          programsList.map(async programItem => {
            const translationData = await SpecialtyTranslate.findOne({
              [this.Model.specialty.ref]: programItem._id,
              [this.Model.language.ref]: selectedLanguage._id
            }).select(queryParameters.selectFields ? queryParameters.selectFields :
                `-${this.Model.specialty.ref} -__v -language -updatedAt`)
                .lean();

            if (programItem.prices && Array.isArray(programItem.prices)) {
              for (const price of programItem.prices) {
                if (price.format) {
                  price.format = await getPopulates('format', price.format, selectedLanguage);
                }
              }
            }
            await Promise.all(
                populateOptions.map(async (item) => {
                  programItem[item] = await getPopulates(item, programItem[item], selectedLanguage);
                }));
            return {...programItem, ...translationData || {}};
          })
      )
    }

    programsList = programsList.filter((item) => item.name);

    return {data: programsList};
  }
}

module.exports = ProgramsService;