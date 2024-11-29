const BaseError = require("../errors/base.error");
const fs = require('fs').promises;

const deleteFilesHelper = async (files) => {
    for (const imagePath of files) {
        try {
            await fs.unlink(imagePath);
        } catch (error) {
            throw BaseError.InternalServerError(error.message);
        }
    }
}

module.exports = deleteFilesHelper;


