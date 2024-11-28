class UploadService {
    async uploadFile(req, res) {
        try {
            let files = req.files.file || [];
            if (!files.length) {
                return res.status(400).json({
                    ok: false,
                    message: "No files uploaded",
                });
            }
            let filePaths = files[0].path;
            return res.status(200).json({
                images: filePaths,
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
