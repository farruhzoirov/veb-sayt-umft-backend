const axios = require('axios');
// --- Models --- //
const Specialty = require('../../models/specialty/specialty.model');
const SpecialtyTranslate = require('../../models/translate/specialty.model');
const Degree = require('../../models/data/degrees.model');
const DegreeTranslate = require('../../models/translate/degrees.model');
const Department = require('../../models/data/department.model');
const Language = require('../../models/settings/language.model');

class FetchSpecialtiesService {
    async fetchSpecialties(req, res) {
        try {
            // Fetch specialties data
            const response = await axios.get('', {
                headers: {
                    'Accept': 'application/json',
                }
            });
            const fetchedSpecialties = response.data;
            // Validate fetched data
            if (!fetchedSpecialties || !Array.isArray(fetchedSpecialties)) {
                return res.status(400).send({
                    ok: false,
                    message: "Invalid specialties data"
                });
            }
            const defaultLanguage = await Language.findOne({isDefault: true}).lean();
            if (!defaultLanguage) {
                return res.status(500).send({
                    ok: false,
                    message: "Default language not found"
                });
            }
            // Process each specialty
            const specialtyPromises = fetchedSpecialties.map(async (specialtyData) => {
                try {
                    // Validate and fetch department
                    const department = await Department.findOne({hemisId: specialtyData.department.id});
                    if (!department) throw new Error(`Department not found for hemisId: ${specialtyData.department.id}`);

                    // Find or create degree
                    let degree = await Degree.findOne({code: specialtyData.educationType.code});
                    if (!degree) {
                        degree = new Degree({code: specialtyData.educationType.code});
                        await degree.save();
                    }

                    // Create specialty and translation entries
                    const newSpecialty = new Specialty({
                        hemisId: specialtyData.id,
                        code: specialtyData.code,
                        department: department._id,
                        degree: degree._id,
                        active: specialtyData.active,
                    });
                    const newSpecialtyTranslate = new SpecialtyTranslate({
                        name: specialtyData.name,
                        language: defaultLanguage._id,
                        specialty: newSpecialty._id,
                    });

                    await Promise.all([
                        newSpecialty.save(),
                        newSpecialtyTranslate.save()
                    ]);

                } catch (err) {
                    console.error(`Error processing specialty ID ${specialtyData.id}: ${err.message}`);
                    throw err;
                }
            });
            await Promise.all(specialtyPromises);
            return res.status(200).send({
                ok: true,
                message: "Specialties fetched and saved successfully"
            });

        } catch (error) {
            console.error('FetchSpecialtiesService Error:', error);
            return res.status(500).send({
                ok: false,
                message: "An error occurred while fetching specialties"
            });
        }
    }
}

module.exports = new FetchSpecialtiesService();
