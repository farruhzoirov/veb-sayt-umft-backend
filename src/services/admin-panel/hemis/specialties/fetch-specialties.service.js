const axios = require('axios');
const Specialty = require('../../../../models/specialty/specialty.model');
const SpecialtyTranslate = require('../../../../models/translate/specialty.model');
const Degree = require('../../../../models/data/degrees.model');
const DegreeTranslate = require('../../../../models/translate/degrees.model');
const Department = require('../../../../models/data/department.model');
const Language = require('../../../../models/settings/language.model');
const config = require('../../../../config/config');

class FetchSpecialtiesService {
    async fetchSpecialties() {
        try {
            const defaultLanguage = await this.getDefaultLanguage();
            const specialtiesData = await this.fetchSpecialtiesData();

            const existingSpecialties = await Specialty.find();
            const existingSpecialtyIds = existingSpecialties.map(s => s.hemisId).filter(hemisId => hemisId !== undefined);

            if (!existingSpecialties.length) {
                await this.addSpecialties(specialtiesData, defaultLanguage);
                return;
            }

            await this.deleteRemovedSpecialties(existingSpecialtyIds, specialtiesData);
            await this.updateOrAddSpecialties(specialtiesData, existingSpecialties, defaultLanguage);

        } catch (error) {
            console.error('Error in fetching specialties:', error);
            throw error;
        }
    }

    async getDefaultLanguage() {
        const language = await Language.findOne({isDefault: true});
        if (!language) throw new Error('Default language not found');
        return language;
    }

    async fetchSpecialtiesData() {
        const limit = 100;
        const page = 0;
        const response = await axios.get(
            `${config.HEMIS_API_URL}/specialty-list?page=${page}&limit=${limit}`,
            {headers: {Authorization: `Bearer ${config.HEMIS_API_TOKEN}`}}
        );
        return response.data.data;
    }

    async addSpecialties(specialties, defaultLanguage) {
        for (const specialty of specialties) {
            const department = await this.findDepartment(specialty.department.id);
            const degree = await this.getOrCreateDegree(specialty.educationType, defaultLanguage);

            const newSpecialty = await new Specialty({
                hemisId: specialty.hemis_id,
                code: specialty.code,
                degree: degree._id,
                slug: "",
                department: department.hemisId,
                structureType: specialty.structureType,
                active: specialty.active,
                prices: [],
                duration: [],
                createdAt: specialty.createdAt,
                updatedAt: specialty.updatedAt
            }).save();

            await new SpecialtyTranslate({
                name: specialty.name,
                language: defaultLanguage._id,
                specialty: newSpecialty._id,
            }).save();
        }
    }

    async deleteRemovedSpecialties(existingSpecialtyIds, specialtiesData) {
        const apiSpecialtyIds = specialtiesData.map(s => s.hemis_id);
        const specialtiesToDelete = existingSpecialtyIds.filter(id => !apiSpecialtyIds.includes(id));

        for (const hemisId of specialtiesToDelete) {
            const specialtyToDelete = await Specialty.findOne({hemisId});
            if (specialtyToDelete) {
                await SpecialtyTranslate.deleteMany({specialty: specialtyToDelete._id});
                await specialtyToDelete.deleteOne();
                console.log(`Deleted specialty with hemisId: ${hemisId}`);
            }
        }
    }

    async updateOrAddSpecialties(specialtiesData, existingSpecialties, defaultLanguage) {
        for (const specialty of specialtiesData) {
            const existingSpecialty = existingSpecialties.find(s => s.hemisId === specialty.hemis_id);

            if (existingSpecialty) {
                if (existingSpecialty.updatedAt.toISOString() !== specialty.updatedAt) {
                    await this.updateSpecialty(existingSpecialty, specialty, defaultLanguage);
                }
            } else {
                await this.addSpecialties([specialty], defaultLanguage);
            }
        }
    }

    async updateSpecialty(existingSpecialty, specialty, defaultLanguage) {
        const department = await this.findDepartment(specialty.department.id);
        const degree = await this.getOrCreateDegree(specialty.educationType, defaultLanguage);

        await existingSpecialty.updateOne({
            hemisId: specialty.hemis_id,
            code: specialty.code,
            degree: degree._id,
            department: department.hemisId,
            structureType: specialty.structureType,
            active: specialty.active,
            prices: [],
            duration: [],
            createdAt: specialty.createdAt,
            updatedAt: specialty.updatedAt
        });

        const existingTranslate = await SpecialtyTranslate.findOne({specialty: existingSpecialty._id});
        if (existingTranslate) {
            await existingTranslate.updateOne({
                name: specialty.name,
                language: defaultLanguage._id,
                specialty: existingSpecialty._id
            });
        }

        console.log(`Updated specialty with hemisId: ${specialty.hemis_id}`);
    }

    async findDepartment(hemisId) {
        const department = await Department.findOne({hemisId}).lean();
        if (!department) throw new Error(`Department not found for hemisId: ${hemisId}`);
        return department;
    }

    async getOrCreateDegree(educationType, defaultLanguage) {
        let degree = await Degree.findOne({code: educationType.code});
        if (!degree) {
            degree = await new Degree({code: educationType.code}).save();
            await new DegreeTranslate({
                name: educationType.name,
                language: defaultLanguage._id,
                degree: degree._id
            }).save();
        }
        return degree;
    }
}


module.exports = FetchSpecialtiesService;
