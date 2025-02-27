const {Schema} = require('mongoose')
const mongoose = require("mongoose");

// It may be Online, Offline or remote study.
const FormatsTranslateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String
  },
  format: {
    type: Schema.Types.ObjectId,
    ref: 'format',
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: "language",
    required: true,
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('formatTranslate', FormatsTranslateSchema);