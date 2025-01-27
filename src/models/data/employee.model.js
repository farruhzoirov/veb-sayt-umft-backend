const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const EmployeeSchema = new Schema({
  hemisId: {
    type: Number,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'department',
    default: null
  },

  slug: {
    type: String
  },
  url: {
    type: String,
  },
  img: [],
  employeeId: {
    type: Number
  },
  socialLinks: [{
    messenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'messenger',
    },
    link: {
      type: String,
    }
  }],
  birthDate: {
    type: String
  },
  status: {
    type: Number,
    default: 1
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