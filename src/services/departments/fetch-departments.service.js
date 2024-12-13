const axios = require('axios');
const Language = require('../../models/settings/language.model');
const Department = require('../../models/data/department.model');
const DepartmentTranslate = require('../../models/translate/department.model');
const cron = require('node-cron');

class FetchDepartmentsService {


  async fetchDepartments() {
      cron.schedule("1, ***** 17", async () => {

      })
  }

  // async fetchDepartments(req, res) {
  //   try {
  //     const defaultLanguage = await Language.findOne({isDefault: true}).lean();
  //     const languageId = defaultLanguage ? defaultLanguage._id : null;
  //
  //     const response = await axios.get('', {
  //       headers: {
  //         'Accept': 'application/json',
  //       }
  //     });  // Replace with actual API URL
  //     const departments = response.data;
  //
  //     if (!Array.isArray(departments)) {
  //       new Error('Departments must be an array');
  //     }
  //
  //     if (!departments.translate || !departments.translate.name) {
  //       new Error('For translate fields are requred');
  //     }
  //
  //     const existingDepartments = await Department.find().lean();
  //     const existingIds = existingDepartments.map(dep => dep.hemisId);
  //     const updatedDepartments = departments.filter((dep) => dep.updatedAt !== existingDepartments.updatedAt);
  //     const removedDepartmentIds = existingDepartments.filter((dep) => !departments.some(d => dep.hemisId === d.id)).map(dep => dep.id);
  //     const newDepartments = departments.filter(dep => !existingIds.includes(dep.id));
  //
  //     const newDepartmentPromises = newDepartments.map(async (department) => {
  //       const savedDepartment = await new Department({
  //         code: department.code,
  //         hemisId: department.id,
  //         structureType: department.structureType,
  //         active: department.active,
  //         createdAt: department.createdAt,
  //         updatedAt: department.updatedAt
  //       }).save()
  //       await new DepartmentTranslate({
  //         name: department.translate.name,
  //         department: savedDepartment._id,
  //         language: languageId
  //       }).save()
  //     });
  //
  //     const updateDepartmentPromises = updatedDepartments.map(async (department) => {
  //       const updatedDepartment = Department.findOneAndUpdate(
  //         {
  //           hemisId: department.id
  //         },
  //         {
  //           set: {
  //             code: department.code,
  //             structureType: department.structureType,
  //             active: department.active,
  //             updatedAt: department.updatedAt,
  //           }
  //         },
  //         {new: true}
  //       );
  //       await DepartmentTranslate.findOneAndUpdate(
  //         {
  //           department: updatedDepartment._id
  //         },
  //         {
  //           $set: {
  //             name: department.translate.name
  //           }
  //         },
  //         {
  //           upsert: true, new: true
  //         }
  //       );
  //     });
  //     const deleteDepartmentPromises = removedDepartmentIds.map(async id => {
  //       await Department.findByIdAndDelete(id);
  //       await DepartmentTranslate.deleteMany({departmentId: id});
  //     });
  //
  //     await Promise.all([
  //       ...newDepartmentPromises,
  //       ...updateDepartmentPromises,
  //       ...deleteDepartmentPromises
  //     ]);
  //     return res.status(200).json({
  //       success: true,
  //       message: 'Departments synchronized successfully'
  //     });
  //   } catch (error) {
  //     console.error('Error in getDepartments:', error);
  //     return res.status(500).json({
  //       ok: false,
  //       message: 'Failed to synchronize departments',
  //       error: error.message
  //     });
  //   }
  // }
}

module.exports = FetchDepartmentsService;
