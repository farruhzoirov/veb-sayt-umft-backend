const { Schema, model } = require('mongoose')
const mongoose = require("mongoose");

const EventsSchema = new Schema({
   img: [],
   time: String,
   eventsCategory: {
       type: Schema.Types.ObjectId,
       ref: 'eventsCategory',
       required: true
   }
});


module.exports = mongoose.model('events', EventsSchema);