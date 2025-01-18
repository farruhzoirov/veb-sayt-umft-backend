const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const EventsCategoryTranslateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  eventsCategory: {
    type: Schema.Types.ObjectId,
    ref: "eventsCategory",
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: "language",
    required: true,
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('eventsCategoryTranslate', EventsCategoryTranslateSchema);