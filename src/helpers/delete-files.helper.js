const path = require('path');
const fs = require('fs').promises;
const BaseError = require("../errors/base.error");

const deleteFilesHelper = async (filePaths) => {
        try {
            if (Array.isArray(filePaths)) {
                for (const filePath of filePaths) {
                    const absolutePath = path.join(process.cwd(), filePath);
                    await fs.access(absolutePath);
                    await fs.unlink(absolutePath);
                }
                return;
            }
            const absolutePath = path.join(process.cwd(), filePaths);
            await fs.access(absolutePath);
            await fs.unlink(absolutePath);
        } catch (error) {
            console.error(`Error deleting file: ${filePaths}`, error.message);
            throw BaseError.BadRequest(error.message);
        }
};

module.exports = deleteFilesHelper;
