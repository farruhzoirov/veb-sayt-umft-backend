const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const EmployeeSchema = new Schema({

}, {
    timestamps: true
});

module.exports = mongoose.model('employee', EmployeeSchema);