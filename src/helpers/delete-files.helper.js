const path = require('path');
const fs = require('fs').promises;
const BaseError = require("../errors/base.error");

const deleteFilesHelper = async (filePath) => {
        try {
            const absolutePath = path.join(process.cwd(), filePath);
            await fs.access(absolutePath);
            await fs.unlink(absolutePath);
        } catch (error) {
            console.error(`Error deleting file: ${filePath}`, error.message);
            throw BaseError.BadRequest(error.message);
        }
};

module.exports = deleteFilesHelper;
