const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const FacultySchema = new Schema({
    img: [],
    status: {
        type: Number,
        default: 1,
    },
    slug: {
        type: String,
    }
});


module.exports = mongoose.model("faculty", FacultySchema);

