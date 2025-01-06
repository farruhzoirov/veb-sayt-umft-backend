const config = require('../../../config/config');
const Employee = require("../../../models/data/employee.model");
const Language = require("../../../models/settings/language.model");
const axios = require("axios");
const DepartmentTranslate = require("../../../models/translate/department.model");


class FetchEmployeesService {
    async fetchEmployees() {
        const stuffPositionCodes = [15, 16, 17];
        const defaultLanguage = await this.getDefaultLanguage();
        const employeesData = await this.fetchEmployeesData(stuffPositionCodes);

        // const existingEmployee = await Employee.find();
        //
        // if (!existingEmployee.length) {
        //     await this.addNewEmployee(employeesData, defaultLanguage);
        //     return;
        // }
        //
        // const apiEmployeeHemisIds = employeesData.map(employee => employee.hemis_id);
        // const existingEmployeeHemisIds = existingEmployee.map(employee => employee.hemisId).filter(hemisId => hemisId !== undefined);
        //
        // await this.deleteRemovedEmployee(existingEmployeeHemisIds, apiEmployeeHemisIds);
        // await this.updateOrAddEmployee(employeesData, defaultLanguage);
    }

    async getDefaultLanguage() {
        return Language.findOne({isDefault: true});
    }

    async fetchEmployeesData(stuffPositionCodes) {
        const limit = 100;
        const page = 0;
        const response = [];
        for (const stuffPosition of stuffPositionCodes) {
            const responseData = await axios.get(`${config.HEMIS_API_URL}/employee-list?page=${page}&_staff_position=${stuffPosition}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${config.HEMIS_API_TOKEN}`,
                },
            });
            response.push(responseData);
        }
        console.log(response)
    }

    async addNewEmployee(employeesData, defaultLanguage) {
        for (const employee of employeesData) {
            const newDepartment = await new Employee({
                hemisId: employee.hemis_id,
                gender: employee.gender,
                structureType: employee.structureType,
                active: employee.active,
                createdAt: employee.createdAt,
                updatedAt: employee.updatedAt,
            }).save();

            await new DepartmentTranslate({
                name: department.name,
                language: defaultLanguage._id,
                department: newDepartment._id,
            }).save();
        }
    }

    async deleteRemovedEmployee(existingEmployeeHemisIds, apiEmployeeHemisIds) {
        for (const existingEmployeeHemisId of existingEmployeeHemisIds) {
            if (!apiEmployeeHemisIds.includes(existingEmployeeHemisId)) {
                const employeeToDelete = await Employee.findOne({hemisId: existingEmployeeHemisId});
                if (employeeToDelete) {
                    await DepartmentTranslate.deleteMany({department: employeeToDelete._id});
                    await employeeToDelete.deleteOne();
                    console.log(`Deleted department with hemisId: ${existingEmployeeHemisId}`);
                }
            }
        }
    }

    async updateOrAddEmployee(employeesData, defaultLanguage) {
        for (const employee of employeesData) {
            const existingEmployee = await Employee.findOne({hemisId: employee.hemis_id});

            if (existingEmployee) {
                if (existingEmployee.updatedAt.toISOString() !== employee.updatedAt) {
                    await existingEmployee.updateOne({
                        $set: {
                            hemisId: employee.hemis_id,
                            code: employee.code,
                            structureType: employee.structureType,
                            active: employee.active,
                            createdAt: employee.createdAt,
                            updatedAt: employee.updatedAt,
                        },
                    });
                    console.log(`Updated department with hemisId: ${employee.hemis_id}`);

                    const existingTranslate = await DepartmentTranslate.findOne({department: existingEmployee._id});
                    if (existingTranslate) {
                        await existingTranslate.updateOne({
                            $set: {
                                name: employee.name,
                                language: defaultLanguage._id,
                                employee: existingEmployee._id,
                            },
                        });
                    }
                    console.log(`Updated translation for department with hemisId: ${employee.hemis_id}`);
                }
            } else {
                const newEmployee = await new Employee({
                    hemisId: employee.hemis_id,
                    code: employee.code,
                    structureType: employee.structureType,
                    active: employee.active,
                    createdAt: employee.createdAt,
                    updatedAt: employee.updatedAt,
                }).save();

                await new DepartmentTranslate({
                    name: employee.name,
                    language: defaultLanguage._id,
                    department: newEmployee._id,
                }).save();
            }
        }
    }
}