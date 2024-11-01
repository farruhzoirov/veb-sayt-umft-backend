const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const DepartmentSchema = new Schema({
    code: {
        type: Number,
        required: true,
    },
    HemisId: {
        type: Number,
    },
    structureType: {

    }
});


module.exports = mongoose.model("department", DepartmentSchema);

