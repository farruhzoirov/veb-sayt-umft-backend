const {Schema, model} = require('mongoose')
const mongoose = require("mongoose");

const EventsTranslateSchema = new Schema({
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
    address: {
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