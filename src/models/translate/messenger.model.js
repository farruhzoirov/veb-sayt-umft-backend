const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const MessengerTranslateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    text: {
        type: String,
    },
    messenger: {
        type: Schema.Types.ObjectId,
        ref: 'messenger',
        required: true
    },
    language: {
        type: Schema.Types.ObjectId,
        ref: 'language',
        required: true
    }
})

module.exports = mongoose.model('messengerTranslate', MessengerTranslateSchema);