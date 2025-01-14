const multer = require('multer');
const path = require('path');
const fs = require("fs");
const {getModel} = require("../../helpers/admin-panel/get-models.helper");

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const model = await getModel(req);
            if (!model) {
               throw new Error(`This Model not found: ${req.params.model}`);
            }
            const destinationDirectory = path.join('uploads', model);
            if (!fs.existsSync(destinationDirectory)) {
                await fs.promises.mkdir(destinationDirectory, { recursive: true });
            }
            cb(null, destinationDirectory);
        } catch (error) {
            cb(error, null);
        }
    },

    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const sanitizedFileName = file.originalname.trim().replace(/\s+/g, '-');
        cb(null, `${uniquePrefix}_${sanitizedFileName}`);
    },
});

const fileFilter =  (req, file, cb) => {
    if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/svg+xml' ||
        file.mimetype === 'application/pdf') {
        cb (null, true);
    } else {
        cb(new Error('Only images and pdfs are allowed'), false);
    }
}

const uploadModelsUtil = multer({
    storage,
    limits: { fileSize: 30 * 1024 * 1024 },  // Max 30mb
    fileFilter: fileFilter
});


module.exports = uploadModelsUtil;
