const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const DurationSchema = new Schema({
    format: {
        type: Schema.Types.ObjectId,
        ref: 'format'
    },
    year: {
        type: Number,
        required: true
    }
})

const SpecialtyTranslateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    text: {
        type: String
    },
    description: {
        type: String,
    },
    duration: [DurationSchema],
    specialty: {
        type: Schema.Types.ObjectId,
        ref: 'specialty',
    },
    status: {
        type: Number,
        default: 1
    },
    language: {
        type: Schema.Types.ObjectId,
        ref: 'language',
        required: true,
    }
})


module.exports = mongoose.model('specialtyTranslate', SpecialtyTranslateSchema);