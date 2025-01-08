const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const EmployeeSchema = new Schema({
    hemisId: {
        type: Number,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'department',
        default: null
    },
    img: [],
    employeeId: {
        type: Number
    },
    socialLinks: [],
    contractNumber: {
        type: String
    },
    decreeNumber: {
        type: String
    },
    contractDate: {
        type: Date
    },
    birthDate: {
        type: Date
    },
    decreeDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('employee', EmployeeSchema);