const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const UniversitySchema = new Schema({
  img: [],
  slug: {
    type: String,
  },
  status: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
})


module.exports = mongoose.model('university', UniversitySchema);