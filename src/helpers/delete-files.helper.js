const path = require('path');
const fs = require('fs').promises;
const BaseError = require("../errors/base.error");

const deleteFilesHelper = async (files) => {
    for (const filePath of files) {
        try {
            const absolutePath = path.join(process.cwd(), filePath); // Convert to absolute path
            await fs.access(absolutePath); // Check if file exists
            await fs.unlink(absolutePath); // Delete file
        } catch (error) {
            console.error(`Error deleting file: ${filePath}`, error.message);
            throw BaseError.BadRequest(error.message);
        }
    }
};

module.exports = deleteFilesHelper;
