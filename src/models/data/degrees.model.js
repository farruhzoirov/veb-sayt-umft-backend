const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const DegreeSchema = new Schema({
    img: [],
    slug: {
        type: String,
        required: [true, "Slug is required"]
    },
    status: {
        type: Number,
        default: 1
    },
});


module.exports = mongoose.model("degree", DegreeSchema);

