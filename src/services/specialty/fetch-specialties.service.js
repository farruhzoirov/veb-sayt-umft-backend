const axios = require('axios');
// ---  Models ---
// Specialty
const Specialty = require('../../models/specialty/specialty.model');
const SpecialtyTranslate = require('../../models/translate/specialty.model');

// Degree
const degree = require('../../models/data/degrees.model');
const degreeTranslate = require('../../models/translate/degrees.model');

// Departments
const Department = require('../../models/data/department.model');
const DepartmentsTranslate = require('../../models/translate/department.model');

// Language
const Language = require('../../models/settings/language.model');

class FetchSpecialtiesService {
    async fetchSpecialties(req, res) {
        try {
            const response = await axios.get('');
            const fetchedSpecialties = response.data;
            if (!fetchedSpecialties || !Array.isArray(fetchedSpecialties)) {
                throw new Error("Specialties data doesn't exist or isn't an Array type");
            }

            const defaultLanguage = await Language.findOne({isDefault: true}).lean();
            if (!defaultLanguage) {
                throw new Error(`Default language not found`);
            }
            for (const specialtyData of fetchedSpecialties) {
                const department = Department.findOne({
                    hemisId: specialtyData.department.id
                });
                if (!department) {
                    console.log(`Department not found for hemisId: ${specialtyData.department.id}`);
                    throw new Error("Department not found for hemisId: " + specialtyData.department.id);
                }
            }
        } catch (error) {
            console.error('FetchSpecialtiesService', error);
            return res.status(400).send({
                ok: false,
                message: error.message,
            })
        }
    }
}