const { Schema, model } = require('mongoose')
const mongoose = require("mongoose");

const EventsCategorySchema = new Schema({
});


module.exports = mongoose.model('eventsCategory', EventsCategorySchema);