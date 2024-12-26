const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const LicencySchema = new Schema({
    img: [],
    
});


module.exports = mongoose.model("licency", LicencySchema);

