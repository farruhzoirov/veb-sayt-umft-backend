const axios = require('axios');

// --- Models --- //
const Specialty = require('../../../../models/specialty/specialty.model');
const SpecialtyTranslate = require('../../../../models/translate/specialty.model');
const Degree = require('../../../../models/data/degrees.model');
const DegreeTranslate = require('../../../../models/translate/degrees.model');
const Department = require('../../../../models/data/department.model');
const Language = require('../../../../models/settings/language.model');
const {default: mongoose} = require("mongoose");
const DepartmentTranslate = require("../../../../models/translate/department.model");

class UpdateSpecialtiesService {
    async updateSpecialties(req, res) {
        try {
            const specialtyId = req.params.specialtyId;
            if (!mongoose.Types.ObjectId.isValid(specialtyId)) {
                return res.status(400).json({
                    ok: false,
                    message: 'Invalid Specialty ID',
                });
            }
            const forAddingTranslateData = {...req.body.translate} || {};
            const findSpecialty = await Specialty.findOne({_id: specialtyId}).lean();
            if (!findSpecialty) {
                return res.status(404).json({
                    ok: false,
                    message: 'Department not found'
                });
            }
            let files = req.files || [];
            if (files && files.image) {
                let imagePaths = (files.image).map((file) => file.path);
                await findSpecialty.updateOne(
                    {
                        _id: specialtyId
                    },
                    {
                        $set: {
                            img: imagePaths,
                        }
                    }
                )
            }
            if (forAddingTranslateData) {
                const newSpecialtyTranslate = await new SpecialtyTranslate({
                    ...forAddingTranslateData,
                    specialty: specialtyId
                });
                await newSpecialtyTranslate.save();
            }
            return res.status(200).json({
                success: true,
                message: 'Specialty updated successfully'
            });
        } catch (error) {
            console.error('UpdateSpecialty Error:', error);
            return res.status(500).json({
                ok: false,
                message: "An error occurred while fetching specialties"
            });
        }
    }
}

module.exports = new UpdateSpecialtiesService();
