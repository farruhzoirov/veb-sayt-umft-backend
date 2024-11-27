const dotenv = require("dotenv");

dotenv.config({ path: '../.env' });

const config = {
    port: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
}


module.exports = config;