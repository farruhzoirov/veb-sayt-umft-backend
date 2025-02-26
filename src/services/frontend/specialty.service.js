const Specialty = require("../../models/specialty/specialty.model");
const SpecialtyTranslate = require("../../models/translate/specialty.model");
const Language = require("../../models/settings/language.model");
const BaseError = require("../../errors/base.error");
const {Model} = require("../../common/constants/models.constants");
const {getPopulates} = require("../../helpers/admin-panel/get-populates.helper");

// For filtering
const Department = require("../../models/data/department.model");
const DepartmentTranslate = require("../../models/translate/department.model");
const Degree = require("../../models/data/degrees.model");
const Format = require("../../models/data/format.model");
const Topic = require("../../models/data/topics.model");
const TopicTranslate = require("../../models/translate/topics.model");
const Theme = require("../../models/data/themes.model");
const Employee = require("../../models/data/employee.model");


class SpecialtiesService {
  constructor() {
    this.Model = Model
  }

  async filterAndGetSpecialties(req) {
    const defaultLanguage = await Language.findOne({isDefault: true});
    const queryParameters = {
      limit: req.query?.limit ? parseInt(req.query.limit, 10) : 30,
      page: req.query?.page ? parseInt(req.query.page, 10) : 1,
      skip: (req.query?.limit ? parseInt(req.query.limit, 10) : 10) * ((req.query.page ? parseInt(req.query.page, 10) : 1) - 1),
      requestedLanguage: req.query?.language || defaultLanguage.slug,
      selectFields: req.query?.select || '',
      filters: {
        department: req.query?.department || '',
        degree: req.query?.degree || '',
        format: req.query?.format || '',
        structureType: req.query?.structureType || '',
      }
    }
    const selectedLanguage = await Language.findOne({
      slug: queryParameters.requestedLanguage,
    }).lean();

    if (!selectedLanguage) {
      throw BaseError.BadRequest("Language doesn't exists which matches to this slug");
    }
    let specialtiesList;
    const query = {status: 1};
    let departmentQuery = {};
    if (queryParameters.filters.structureType) {
      departmentQuery["structureType.code"] = queryParameters.filters.structureType;
    }

    const departments = await Department.find(departmentQuery).lean();
    const departmentIds = departments.map(dep => dep._id);
    const departmentTranslations = await DepartmentTranslate.find({
      department: { $in: departmentIds },
      language: selectedLanguage._id,
    }).lean();

    if (queryParameters.filters.department) {
      const department = await Department.findOne({slug: queryParameters.filters.department}).lean();
      query.department = department?._id;
    } else if (queryParameters.filters.structureType) {
      const departmentIds = await Department.find({"structureType.code": queryParameters.filters.structureType}).distinct('_id');
      query.department = {$in: departmentIds};
    }

    if (queryParameters.filters.degree) {
      const degree = await Degree.findOne({slug: queryParameters.filters.degree}).lean();
      query.degree = degree?._id;
    }

    if (queryParameters.filters.format) {
      const format = await Format.findOne({slug: queryParameters.filters.format}).lean();
      query["prices.format"] = format?._id;
    }
    specialtiesList = await Specialty.find(query)
        .select(queryParameters.select ? queryParameters.select : "-monthlyViews -__v -updatedAt")
        .limit(queryParameters.limit).skip(queryParameters.skip).lean();


    if (specialtiesList.length) {
      specialtiesList = await Promise.all(
          specialtiesList.map(async specialtyItem => {
            const translationData = await SpecialtyTranslate.findOne({
              [this.Model.specialty.ref]: specialtyItem._id,
              [this.Model.language.ref]: selectedLanguage._id
            }).select(queryParameters.selectFields ? queryParameters.selectFields :
                `-${this.Model.specialty.ref} -__v -language -updatedAt`).lean();

            if (specialtyItem.prices && Array.isArray(specialtyItem.prices)) {
              for (const price of specialtyItem.prices) {
                if (price.format) {
                  price.format = await getPopulates('format', price.format, selectedLanguage);
                }
              }
            }
            return {...specialtyItem, ...translationData || {}};
          })
      )
    }

    specialtiesList = specialtiesList.filter((item) => item.name);

    const departmentMap = {};
    departments.forEach(dep => {
      const translation = departmentTranslations.find(dt => dt.department.toString() === dep._id.toString());
      departmentMap[dep._id] = {
        _id: dep._id,
        name: translation ? translation.name : null,
        specialties: [],
      };
    });

    specialtiesList.forEach((spec) => {
      if (departmentMap[spec.department]) {
        departmentMap[spec.department].specialties.push(spec);
      }
    })

    const total = await Specialty.countDocuments(query);

    return {data: Object.values(departmentMap), total: total};
  }



  async getOneSpecialty(req) {
    const defaultLanguage = await Language.findOne({isDefault: true});
    const queryParameters = {
      slug: req.params.slug,
      requestedLanguage: req.query.language || defaultLanguage.slug,
    }

    const selectedLanguage = await Language.findOne({
      slug: queryParameters.requestedLanguage,
    }).lean();

    if (!selectedLanguage) {
      throw BaseError.BadRequest("Language doesn't exists which matches to this slug");
    }

    let findSpecialty = await Specialty.findOne({slug: queryParameters.slug}).lean();

    if (!findSpecialty) {
      return {};
    }

    // Employees
    let findEmployees = await Employee.find({[this.Model.department.ref]: findSpecialty.department}).lean();
    console.log('employee', findEmployees)
    // Level and topic based
    let findTopics = await Topic.find({[this.Model.specialty.ref]: findSpecialty._id}).lean();
    console.log("topic", findTopics)

    // Themes
    let findThemes = await Theme.find({[this.Model.topic.ref]: findTopics._id}).lean();
    console.log("findThemes", findThemes)

    if (findSpecialty) {
      if (findSpecialty.prices && Array.isArray(findSpecialty.prices)) {
        for (const price of findSpecialty.prices) {
          if (price.format) {
            price.format = await getPopulates('format', price.format, selectedLanguage);
          }
        }
      }
      findSpecialty = await SpecialtyTranslate.findOne({
        [this.Model.specialty.ref]: findSpecialty._id,
        [this.Model.language.ref]: selectedLanguage._id
      }).select(queryParameters.selectFields ? queryParameters.selectFields : `-${this.Model.specialty.ref} -__v -language -updatedAt`).lean();
    }

    if (findTopics.length) {
      const populateOptions = this.Model.topic.populate || [];
      findTopics = await this.getTranslatesAndPopulates(this.Model.topic.ref, findTopics, TopicTranslate, selectedLanguage, '', populateOptions);
      console.log('translate topic', findTopics)
      findSpecialty.topics = findTopics;
    }

    if (findEmployees.length) {
      console.log('employee')
      console.log('employee', findEmployees);
      findEmployees = await this.getTranslatesAndPopulates(this.Model.employee.ref, findEmployees, TopicTranslate, selectedLanguage, '', []);
      console.log('translate employee', findEmployees);
      await Promise.all(
          findEmployees.map(async employee => {
            employee.messenger = await getPopulates("messenger", employee.messenger, selectedLanguage);
          })
      );
      findSpecialty.employees = findEmployees;
    }

    if (findThemes.length) {
      const populateOptions = this.Model.theme.populate || [];
      findThemes = await this.getTranslatesAndPopulates(this.Model.theme.ref, findEmployees, TopicTranslate, selectedLanguage, '', populateOptions);
      console.log('translate theme', findThemes);
      findSpecialty.themes = findThemes;
    }


    return {data: findSpecialty};
  }

  async getTranslatesAndPopulates(modelName, model, translateModel, language, select, populateOptions = []) {
    await Promise.all(model.map(async (data) => {
      data = await translateModel.findOne({
        [modelName]: model._id,
        [this.Model.language.ref]: language._id
      }).select(select ? select : `-${modelName} -__v -language -updatedAt`).lean();

      if (populateOptions.length) {
        populateOptions.map(async (item) => {
          if (Object.keys(data).includes(item)) {
            data[item] = await getPopulates(item, data[item], language);
          }
        })
      }
      return data;
    }));

    return model;
  }
}

module.exports = SpecialtiesService;