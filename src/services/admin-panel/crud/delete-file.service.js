const deleteFilesHelper = require('../../../helpers/admin-panel/delete-files.helper');

class deleteFileService {
  async deleteFile(filePath) {
    await deleteFilesHelper(filePath);
  }
}

module.exports = deleteFileService;
