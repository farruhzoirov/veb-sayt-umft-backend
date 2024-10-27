const { Schema } = require('mongoose')
const mongoose = require("mongoose");

const EventsCategoryTranslateSchema = new Schema({
    name: {
        type: String,
        required: true,
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
});


module.exports = mongoose.model('eventsCategoryTranslate', EventsCategoryTranslateSchema);