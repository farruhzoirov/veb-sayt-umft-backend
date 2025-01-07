const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const EmployeeTranslateSchema = new Schema({
    fullName: { type: String, required: true },
    shortName: { type: String },
    firstName: { type: String },
    secondName: { type: String },
    thirdName: { type: String },
    gender: {
        code: { type: String },
        name: { type: String },
    },
    academicRank: {
        code: { type: String },
        name: { type: String },
    },
    staffPosition: {
        code: { type: String },
        name: { type: String },
    },
    employeeType: {
        code: { type: String },
        name: { type: String },
    },
    employeeStatus: {
        code: { type: String },
        name: { type: String },
    },
    language: { type: mongoose.Schema.Types.ObjectId, ref: 'language', required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee', required: true },
}, {
    timestamps: true
});


module.exports = mongoose.model("employeeTranslate", EmployeeTranslateSchema);

