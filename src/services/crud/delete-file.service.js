const deleteFilesHelper = require('../../helpers/delete-files.helper');

class deleteFileService {
  async deleteFile(filePath) {
    await deleteFilesHelper(filePath);
  }
}

module.exports = deleteFileService;
