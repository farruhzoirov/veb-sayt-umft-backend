const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const StructureType =  new Schema({
        code: String,
        name: String,
})

// hemisId is departmentId in the hemis.
const DepartmentSchema = new Schema({
    code: {
        type: Number,
        required: true,
    },
    hemisId: {
        type: Number,
    },
    structureType: StructureType,
    active: {
        type: Boolean,
        default: true,
    },
});


module.exports = mongoose.model("department", DepartmentSchema);

