const {Schema, model} = require('mongoose')
const mongoose = require("mongoose");

// Partners
const PartnerTranslateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String
  },
  description: {
    type: String,
    required: true,
  },
  partner: {
    type: Schema.Types.ObjectId,
    ref: "partners",
    required: true,
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: "language",
    required: true,
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('partnerTranslate', PartnerTranslateSchema);