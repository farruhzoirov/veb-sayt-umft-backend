const EmployeesTranslate = require('../../models/translate/employee.model')
const Employee = require('../../models/data/employee.model')
const BaseError = require("../../errors/base.error");
const getDefaultLanguageHelper = require("../../helpers/frontend/get-default-language.helper");
const Language = require("../../models/settings/language.model");

class EmployeeService {
  async getEmployeesForFront(req) {
    const defaultLanguage = await getDefaultLanguageHelper();

    const queryParameters = {
      staffPosition: req.query?.staffPosition,
      requestedLanguage: req.query?.language || defaultLanguage.slug
    }

    const selectedLanguage = await Language.findOne({slug: queryParameters.requestedLanguage}).lean();

    if (!selectedLanguage) {
      throw BaseError.BadRequest("Language doesn't exists which matches to this slug");
    }

    if (!queryParameters.staffPosition || typeof queryParameters.staffPosition !== 'string') {
      throw BaseError.BadRequest("Staff position code is required or must be a string");
    }

    const findEmployeesByStaffPosition = await EmployeesTranslate.find({
      "staffPosition.code": queryParameters.staffPosition,
      "language": selectedLanguage._id
    }).populate({
      path: "employee",
      populate: {
        path: "department",
        match: {
          "language": selectedLanguage._id
        }
      }
    }).lean();

    if (!findEmployeesByStaffPosition.length) {
      return [];
    }

    return findEmployeesByStaffPosition;

  }
}


module.exports = EmployeeService;