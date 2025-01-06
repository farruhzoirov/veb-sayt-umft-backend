const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const config = {
  APP_PORT: process.env.APP_PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  HEMIS_API_URL: process.env.HEMIS_API_URL,
  HEMIS_API_TOKEN: process.env.HEMIS_API_TOKEN,
};

module.exports = config;
