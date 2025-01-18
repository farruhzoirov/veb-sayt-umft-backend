const {Schema, model} = require('mongoose')
const mongoose = require("mongoose");

const UniversityTranslateSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  text: {
    type: String
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: "language",
    required: true,
  },
  university: {
    type: Schema.Types.ObjectId,
    ref: "university",
    required: true,
  }
}, {
  timestamps: true
})


module.exports = mongoose.model('universityTranslate', UniversityTranslateSchema);