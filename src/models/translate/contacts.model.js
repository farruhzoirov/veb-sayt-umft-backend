const {Schema} = require("mongoose");
const mongoose = require('mongoose');

const ContactsTranslateSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  contact: {
    type: Schema.Types.ObjectId,
    ref: "contact",
    required: true,
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: 'language',
    required: true,
  }
}, {
  timestamps: true
})


module.exports = mongoose.model('contactTranslate', ContactsTranslateSchema);



