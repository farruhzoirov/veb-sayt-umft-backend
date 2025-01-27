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

const Topic = require("../../models/data/topics.model");
const TopicTranslate = require("../../models/translate/topics.model");

const Theme = require("../../models/data/themes.model");

const Employee = require("../../models/data/employee.model");


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

    if (queryParameters.filters.format) {
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


  async getOneProgram(req) {
    const defaultLanguage = await Language.findOne({isDefault: true});
    const queryParameters = {
      program: req.params.slug,
      requestedLanguage: req.query.language || defaultLanguage.slug,
    }

    const selectedLanguage = await Language.findOne({
      slug: queryParameters.requestedLanguage,
    }).lean();

    if (!selectedLanguage) {
      throw BaseError.BadRequest("Language doesn't exists which matches to this slug");
    }

    let findProgram = await Specialty.findOne({slug: queryParameters.program}).lean();

    if (!findProgram) {
      throw BaseError.BadRequest("Program not found");
    }

    // Employees
    let findEmployees = await Employee.find({[this.Model.department.ref]: findProgram.department}).lean();

    // Level and topic based
    let findTopics = await Topic.find({[this.Model.specialty.ref]: findProgram._id}).lean();

    // Themes
    let findThemes = await Theme.find({[this.Model.topic.ref]: findTopics._id}).lean();

    if (findProgram) {
      if (findProgram.prices && Array.isArray(findProgram.prices)) {
        for (const price of findProgram.prices) {
          if (price.format) {
            price.format = await getPopulates('format', price.format, selectedLanguage);
          }
        }
      }
      findProgram = await this.getTranslatesAndPopulates(this.Model.specialty.ref, [findProgram], SpecialtyTranslate, selectedLanguage, queryParameters.selectFields);
    }

    if (findTopics) {
      console.log('topics')
      const populateOptions = this.Model.topic.populate || [];
      findTopics = await this.getTranslatesAndPopulates(this.Model.topic.ref, findTopics, TopicTranslate, selectedLanguage, '', populateOptions);
      findProgram.topics = findTopics;
    }

    if (findEmployees) {
      console.log('employee')
      findEmployees = await this.getTranslatesAndPopulates(this.Model.employee.ref, findEmployees, TopicTranslate, selectedLanguage, '', []);
      await Promise.all(
          findEmployees.map(async employee => {
            employee.messenger = await getPopulates("messenger", employee.messenger, selectedLanguage);
          })
      );
      findProgram.employees = findEmployees;
    }

    if (findThemes) {
      console.log('themes')
      const populateOptions = this.Model.theme.populate || [];
      findThemes = await this.getTranslatesAndPopulates(this.Model.employee.ref, findEmployees, TopicTranslate, selectedLanguage, '', populateOptions);
      findProgram.themes = findThemes;
    }
    return {data:findProgram};
  }

  async getTranslatesAndPopulates(modelName, model, translateModel, language, select, populateOptions = []) {
    await Promise.all(model.map(async (data) => {
      data = await translateModel.findOne({
        [modelName]: model._id,
        [this.Model.language.ref]: language._id
      }).select(select ? select : `-${modelName} -__v -language -updatedAt`).lean();

      if (populateOptions.length) {
        populateOptions.map(async (item) => {
          data[item] = await getPopulates(item, data[item], language);
          console.log(data[item]);
        })
      }
      return data;
    }));

    return model;
  }
}

module.exports = ProgramsService;