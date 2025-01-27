const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const EventsSchema = new Schema({
  img: [],
  from: String,
  to: String,
  eventsCategory: [{
    type: Schema.Types.ObjectId,
    ref: 'eventsCategory',
    required: true,
  }],
  views: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
  },
  status: {
    type: Number,
    default: 1
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('events', EventsSchema);