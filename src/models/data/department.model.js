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
    slug: {
        type: String,
        required: [true, "Slug is required"]
    },
    img: [],
    structureType: StructureType,
    active: {
        type: Boolean,
        default: true,
    },
    status: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }
});

module.exports = mongoose.model("department", DepartmentSchema);

