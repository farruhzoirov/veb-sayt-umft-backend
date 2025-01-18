const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const EventsCategorySchema = new Schema({
  img: [],
  slug: {
    type: String,
    required: [true, "Slug is required"]
  },
  status: {
    type: Number,
    default: 1
  },
}, {
  timestamps: true
});


module.exports = mongoose.model('eventsCategory', EventsCategorySchema);