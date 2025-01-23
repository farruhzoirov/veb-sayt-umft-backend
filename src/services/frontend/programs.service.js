const Specialty = require("../../models/specialty/specialty.model");
const SpecialtyTranslate = require("../../models/translate/specialty.model");
const Language = require("../../models/settings/language.model");
const BaseError = require("../../errors/base.error");
const {Model} = require("../../common/constants/models.constants");
const {getPopulates} = require("../../helpers/admin-panel/get-populates.helper");

// For filtering
const Department = require("../../models/data/department.model");
const Degree = require("../../models/data/degrees.model");
const Format = require("../../models/data/format.model");

class ProgramsService {
  constructor() {
    this.Model = Model
  }

  async filterAndGetPrograms(req) {
    const defaultLanguage = await Language.findOne({isDefault: true});
    const queryParameters = {
      limit: req.query?.limit ? parseInt(req.query.limit, 10) : 30,
      page: req.query?.page ? parseInt(req.query.page, 10) : 1,
      skip: (req.query?.limit ? parseInt(req.query.limit, 10) : 10) * ((req.query.page ? parseInt(req.query.page, 10) : 1) - 1),
      requestedLanguage: req.query?.language || defaultLanguage.slug,
      selectFields: req.query?.select || '',
      // For filtering
      filters: {
        department: req.query?.department || '',
        degree: req.query?.degree || '',
        format: req.query?.format || '',
      }
    }
    const selectedLanguage = await Language.findOne({
      slug: queryParameters.requestedLanguage,
    }).lean();

    if (!selectedLanguage) {
      throw BaseError.BadRequest("Language doesn't exists which matches to this slug");
    }

    let programsList;

    const query = {};

    if (queryParameters.filters.department) {
      const department = await Department.findOne({slug: queryParameters.filters.department}).lean();
      query.department = department?._id;
    }

    if (queryParameters.filters.degree) {
      const degree = await Degree.findOne({slug: queryParameters.filters.degree}).lean();
      query.degree = degree?._id;
    }

    if (queryParameters.filters.format){
      const format = await Format.findOne({slug: queryParameters.filters.format}).lean();
      query["prices.format"] = format?._id;
    }


    programsList = await Specialty.find(query).select(queryParameters.select).limit(queryParameters.limit).skip(queryParameters.skip).lean();

    if (programsList.length) {
      programsList = await Promise.all(
          programsList.map(async programItem => {

            const translationData = await SpecialtyTranslate.findOne({
              [this.Model.specialty.ref]: programItem._id,
              [this.Model.language.ref]: selectedLanguage._id
            }).select(queryParameters.selectFields ? queryParameters.selectFields : `-${this.Model.specialty.ref} -__v -language -updatedAt`).lean();

            if (programItem.prices && Array.isArray(programItem.prices)) {
              for (const price of programItem.prices) {
                if (price.format) {
                  price.format = await getPopulates('format', price.format, selectedLanguage);
                }
              }
            }

            return {...programItem, ...translationData || {}};
          })
      )
    }

    programsList = programsList.filter((item) => item.name);
    const total = await Specialty.countDocuments({status: 1});

    const paginationInfo = {
      total: total,
      limit: queryParameters.limit,
      page: queryParameters.page,
      pages: Math.ceil(total / queryParameters.limit),
    };

    return {data: programsList, pagination: paginationInfo};
  }
}

module.exports = ProgramsService;