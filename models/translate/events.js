const {Schema, model} = require('mongoose')
const mongoose = require("mongoose");

const EventsTranslateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    events: {
        type: Schema.Types.ObjectId,
        ref: "events",
        required: true,
    },
    language: {
        type: Schema.Types.ObjectId,
        ref: "language",
        required: true,
    }
});

module.exports = mongoose.model('eventsTranslate', EventsTranslateSchema);