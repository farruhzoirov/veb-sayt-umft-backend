const { Schema, model } = require('mongoose')
const mongoose = require("mongoose");

const EventsCategorySchema = new Schema({
    img: [],
    status: {
        type: Number,
        default: 1
    },
});


module.exports = mongoose.model('eventsCategory', EventsCategorySchema);