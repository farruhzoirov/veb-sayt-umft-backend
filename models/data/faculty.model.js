const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const FacultySchema = new Schema({
    img: [],
    status: {
        type: Number,
    }
});


module.exports = mongoose.model("faculty", FacultySchema);

