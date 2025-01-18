const axios = require('axios');
const Language = require('../../../../models/settings/language.model');
const Department = require('../../../../models/data/department.model');
const DepartmentTranslate = require('../../../../models/translate/department.model');
const config = require('../../../../config/config');

class FetchDepartmentsService {
  async fetchDepartments() {
    const defaultLanguage = await this.getDefaultLanguage();
    const departmentsData = await this.fetchDepartmentsData();

    const existingDepartments = await Department.find();

    if (!existingDepartments.length) {
      await this.addNewDepartments(departmentsData, defaultLanguage);
      return;
    }

    const apiDepartmentsHemisIds = departmentsData.map(department => department.hemis_id);
    const existingDepartmentsHemisIds = existingDepartments.map(department => department.hemisId).filter(hemisId => hemisId !== undefined);

    await this.deleteRemovedDepartments(existingDepartmentsHemisIds, apiDepartmentsHemisIds);
    await this.updateOrAddDepartments(departmentsData, defaultLanguage);
  }

  async getDefaultLanguage() {
    return Language.findOne({isDefault: true});
  }

  async fetchDepartmentsData() {
    const limit = 100;
    const page = 0;
    const response = await axios.get(`${config.HEMIS_API_URL}/department-list?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${config.HEMIS_API_TOKEN}`,
      },
    });
    return response.data.data;
  }

  async addNewDepartments(departmentsData, defaultLanguage) {
    for (const department of departmentsData) {
      const newDepartment = await new Department({
        hemisId: department.hemis_id,
        code: department.code,
        slug: "",
        structureType: department.structureType,
        active: department.active,
        createdAt: department.createdAt,
        updatedAt: department.updatedAt,
      }).save();

      await new DepartmentTranslate({
        name: department.name,
        language: defaultLanguage._id,
        department: newDepartment._id,
      }).save();
    }
  }

  async deleteRemovedDepartments(existingDepartmentsHemisIds, apiDepartmentsHemisIds) {
    for (const existingDepartmentId of existingDepartmentsHemisIds) {
      if (!apiDepartmentsHemisIds.includes(existingDepartmentId)) {
        const departmentToDelete = await Department.findOne({hemisId: existingDepartmentId});
        if (departmentToDelete) {
          await DepartmentTranslate.deleteMany({department: departmentToDelete._id});
          await departmentToDelete.deleteOne();
          console.log(`Deleted department with hemisId: ${existingDepartmentId}`);
        }
      }
    }
  }

  async updateOrAddDepartments(departmentsData, defaultLanguage) {
    for (const department of departmentsData) {
      const existingDepartment = await Department.findOne({hemisId: department.hemis_id});

      if (existingDepartment) {
        if (existingDepartment.updatedAt.toISOString() !== department.updatedAt) {
          await existingDepartment.updateOne({
            $set: {
              hemisId: department.hemis_id,
              code: department.code,
              structureType: department.structureType,
              active: department.active,
              createdAt: department.createdAt,
              updatedAt: department.updatedAt,
            },
          });
          console.log(`Updated department with hemisId: ${department.hemis_id}`);

          const existingTranslate = await DepartmentTranslate.findOne({department: existingDepartment._id});
          if (existingTranslate) {
            await existingTranslate.updateOne({
              $set: {
                name: department.name,
                language: defaultLanguage._id,
                department: existingDepartment._id,
              },
            });
          }
          console.log(`Updated translation for department with hemisId: ${department.hemis_id}`);
        }
      } else {
        const newDepartment = await new Department({
          hemisId: department.hemis_id,
          code: department.code,
          slug: "",
          structureType: department.structureType,
          active: department.active,
          createdAt: department.createdAt,
          updatedAt: department.updatedAt,
        }).save();

        await new DepartmentTranslate({
          name: department.name,
          language: defaultLanguage._id,
          department: newDepartment._id,
        }).save();
      }
    }
  }
}


module.exports = FetchDepartmentsService;
