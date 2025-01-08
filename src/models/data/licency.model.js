const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const LicencySchema = new Schema({
    img: [],
    file: [],
    name: {
        type: String,
        required: true,
    }
});


module.exports = mongoose.model("licency", LicencySchema);

