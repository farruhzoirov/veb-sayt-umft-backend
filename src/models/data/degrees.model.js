const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const DegreeSchema = new Schema({
    status: {
        type: Number,
        default: 0
    }
});


module.exports = mongoose.model("degree", DegreeSchema);

