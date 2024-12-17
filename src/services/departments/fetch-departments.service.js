const axios = require('axios');
const Language = require('../../models/settings/language.model');
const Department = require('../../models/data/department.model');
const DepartmentTranslate = require('../../models/translate/department.model');
const config = require('../../config/config');

class FetchDepartmentsService {
  async fetchDepartments() {
    const limit = 100;
    let page = 0;
    const response = await axios.get(`https://hemisapi.umft.uz/department-list?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${config.HEMIS_API_TOKEN}`
      }
    });
    const data = response.data;
    const existingDepartment = await Department.find();

    if (!existingDepartment.length) {
      for (let department of data.data) {
        const newDepartment = await new Department({
          hemisId: department.hemis_id,
          code: department.code,
          structureType: department.structureType,
          active: department.active,
          createdAt: department.createdAt,
          updatedAt: department.updatedAt
        }).save();
        await new DepartmentTranslate({
          name: department.name,
          language: await Language.findOne({isDefault: true}),
          department: newDepartment._id
        }).save();
      }
      return;
    }

    const apiDepartmentsHemisIds = data.data.map((department) => department.hemis_id);
    const existingDepartmentsHemisIds = existingDepartment.map((department) => department.hemisId);

    for (let existingDepartmentId of existingDepartmentsHemisIds) {
      if (!apiDepartmentsHemisIds.includes(existingDepartmentId)) {
        const departmentToDelete = await Department.findOne({hemisId: existingDepartmentId});
        if (departmentToDelete) {
          await DepartmentTranslate.deleteMany({department: departmentToDelete._id});
          await departmentToDelete.deleteOne();
          console.log(`Deleted department with hemisId: ${existingDepartmentId}`);
        }
      }
    }

    for (let department of data.data) {
      const isExistDepartment = await Department.findOne({hemisId: department.hemis_id});
      if (isExistDepartment) {
        if (isExistDepartment.updatedAt.toISOString() !== department.updatedAt) {
          await isExistDepartment.updateOne(
            {},
            {
              set: {
                hemisId: department.hemis_id,
                code: department.code,
                structureType: department.structureType,
                active: department.active,
                createdAt: department.createdAt,
                updatedAt: department.updatedAt,
              }
            });
          console.log(`Updated department with hemisId: ${department.hemis_id}`);
          const existTranslate = await DepartmentTranslate.findOne({department: isExistDepartment._id});
          if (existTranslate) {
            await existTranslate.updateOne({},
              {
                $set: {
                  name: department.name,
                  language: await Language.findOne({isDefault: true}),
                  department: isExistDepartment._id
                }
              }
            )
          }
          console.log(`Updated translation for department with hemisId: ${department.hemis_id}`);
        }
        return;
      }
    }
  }
}

module.exports = FetchDepartmentsService;
