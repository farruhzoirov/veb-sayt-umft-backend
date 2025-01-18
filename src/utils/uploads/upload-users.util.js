const multer = require('multer');
const path = require('path');
const fs = require("fs");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const model = req.params.model;
      const destinationDirectory = path.join('images', "user");
      await fs.promises.mkdir(destinationDirectory, {recursive: true});
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

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/svg') {
    cb(null, true);
  } else {
    cb(new Error('Only images  are allowed'), false);
  }
}
const uploadUsersUtil = multer({
  storage,
  limits: {fileSize: 30 * 1024 * 1024},  // Max 30mb
  fileFilter: fileFilter
});


module.exports = uploadUsersUtil;
