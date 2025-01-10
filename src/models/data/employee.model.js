const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const EmployeeSchema = new Schema({
  hemisId: {
    type: Number,
    required: true,
    unique: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'department',
    default: null
  },
  slug: {
    type: String
  },
  img: [],
  employeeId: {
    type: Number
  },
  socialLinks: [{
    messenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'messenger',
      required: true
    },
    link: {
      type: String,
      required: true
    }
  }],
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