const axios = require("axios");

const config = require('../../../../config/config');

const Employee = require("../../../../models/data/employee.model");
const EmployeeTranslate = require("../../../../models/translate/employee.model");

const Department = require("../../../../models/data/department.model");

const Language = require("../../../../models/settings/language.model");
const BaseError = require("../../../../errors/base.error");


class FetchEmployeesService {
  async fetchEmployees() {
    // const stuffPositionCodes = [12,13, 14, 15, 16, 17, 26,34, 61, 233];
    const defaultLanguage = await this.getDefaultLanguage();
    const employeesData = await this.fetchEmployeesData();

    const existingEmployee = await Employee.find();

    if (!existingEmployee.length) {
      await this.addNewEmployee(employeesData, defaultLanguage);
      return;
    }

    const apiEmployeeHemisIds = employeesData.map(employee => employee.hemis_id);
    const existingEmployeeHemisIds = existingEmployee.map(employee => employee.hemisId).filter(hemisId => hemisId !== undefined);

    await this.deleteRemovedEmployee(existingEmployeeHemisIds, apiEmployeeHemisIds);
    await this.updateOrAddEmployee(employeesData, defaultLanguage);
  }

  async getDefaultLanguage() {
    return Language.findOne({isDefault: true});
  }

  async fetchEmployeesData(page = 1, limit = 30, response = []) {
    const responseData = await axios.get(`${config.HEMIS_API_URL}/employee-list?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${config.HEMIS_API_TOKEN}`,
      },
    });

    response.push(...responseData.data.data);

    if (page <= responseData.data.pagination.pageCount) {
      return this.fetchEmployeesData(page + 1, limit, response);
    }

    return response;
  }

  async addNewEmployee(employeesData, defaultLanguage) {
    for (const employee of employeesData) {

      const matchDepartment = await Department.findOne({hemisId: employee.department.id});
      const newEmployee = await new Employee({
        hemisId: employee.hemis_id,
        department: matchDepartment ? matchDepartment._id : null,
        url: employee.image,
        img: [],
        socialLinks: [],
        slug: this.slugify(`${employee.first_name}${employee.second_name}${employee.third_name}`),
        employeeId: employee.employee_id_number,
        birthDate: employee.birth_date,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
      }).save();

      await new EmployeeTranslate({
        firstName: employee.first_name,
        lastName: employee.second_name,
        surName: employee.third_name,
        receptionTime: '',
        text: '',
        gender: employee.gender,
        academicRank: employee.academicRank,
        staffPosition: employee.staffPosition,
        employeeType: employee.employeeType,
        employeeStatus: employee.employeeStatus,
        language: defaultLanguage._id,
        employee: newEmployee._id,
      }).save();
    }
  }

  async deleteRemovedEmployee(existingEmployeeHemisIds, apiEmployeeHemisIds) {
    for (const existingEmployeeHemisId of existingEmployeeHemisIds) {
      if (!apiEmployeeHemisIds.includes(existingEmployeeHemisId)) {
        const employeeToDelete = await Employee.findOne({hemisId: existingEmployeeHemisId});
        if (employeeToDelete) {
          await Employee.deleteMany({employee: employeeToDelete._id});
          await employeeToDelete.deleteOne();
          console.log(`Deleted employee with hemisId: ${existingEmployeeHemisId}`);
        }
      }
    }
  }

  async updateOrAddEmployee(employeesData, defaultLanguage) {
    for (const employee of employeesData) {
      const existingEmployee = await Employee.findOne({hemisId: employee.hemis_id});
      const matchDepartment = await Department.findOne({hemisId: employee.department.id});
      if (existingEmployee) {
        if (existingEmployee.updatedAt.toISOString() !== employee.updatedAt) {
          await existingEmployee.updateOne({
            $set: {
              hemisId: employee.hemis_id,
              department: matchDepartment ? matchDepartment._id : null,
              url: employee.image,
              img: [],
              employeeId: employee.employee_id_number,
              contractNumber: employee.contract_number,
              decreeNumber: employee.decree_number,
              contractDate: employee.contract_date,
              birthDate: employee.birth_date,
              decreeDate: employee.decree_date,
              createdAt: employee.createdAt,
              updatedAt: employee.updatedAt,
            },
          });
          console.log(`Updated employee with hemisId: ${employee.hemis_id}`);

          const existingTranslate = await EmployeeTranslate.findOne({employee: existingEmployee._id});
          if (existingTranslate) {
            await existingTranslate.updateOne({
              $set: {
                firstName: employee.first_name,
                lastName: employee.second_name,
                surName: employee.third_name,
                receptionTime: '',
                text: '',
                gender: employee.gender,
                academicRank: employee.academicRank,
                staffPosition: employee.staffPosition,
                employeeType: employee.employeeType,
                employeeStatus: employee.employeeStatus,
                language: defaultLanguage._id,
                employee: existingEmployee._id,
              },
            });
          }
          console.log(`Updated translation for employee with hemisId: ${employee.hemis_id}`);
        }

      } else {
        const newEmployee = await new Employee({
          hemisId: employee.hemis_id,
          department: matchDepartment ? matchDepartment._id : null,
          url: employee.image,
          img: [],
          socialLinks: [],
          slug: this.slugify(`${employee.first_name}${employee.second_name}${employee.third_name}`),
          employeeId: employee.employee_id_number,
          contractNumber: employee.contract_number,
          decreeNumber: employee.decree_number,
          contractDate: employee.contract_date,
          birthDate: employee.birth_date,
          decreeDate: employee.decree_date,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
        }).save();

        await new EmployeeTranslate({
          firstName: employee.first_name,
          lastName: employee.second_name,
          surName: employee.third_name,
          receptionTime: '',
          text: '',
          gender: employee.gender,
          academicRank: employee.academicRank,
          staffPosition: employee.staffPosition,
          employeeType: employee.employeeType,
          employeeStatus: employee.employeeStatus,
          language: defaultLanguage._id,
          employee: newEmployee._id,
        }).save();
      }
    }
  }


  slugify(str) {
    return str
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-əöğıüçş]/g, '');
  };
}

module.exports = FetchEmployeesService