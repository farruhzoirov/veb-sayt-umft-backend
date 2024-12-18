const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const DegreeSchema = new Schema({
    img: [],
    code: {
        type: String,
        required: [true, "code is required"]
    },
    slug: {
        type: String,
    },
    status: {
        type: Number,
        default: 1
    },
});


module.exports = mongoose.model("degree", DegreeSchema);

