const {BaseError} = require("../../errors/base.error");

class UploadService {
    async uploadFile(req, res) {
        try {
            let files = req.files.file || [];
            if (!files.length) {
                throw BaseError.BadRequest('No file uploaded');
            }
            let filePaths = files[0].path;
            return res.status(200).json({
                files: filePaths,
            });
        } catch (error) {
            console.error("Upload Error:", error);
            return res.status(500).json({
                ok: false,
                message: "Error uploading files",
            });
        }
    }
}

module.exports =  UploadService;
