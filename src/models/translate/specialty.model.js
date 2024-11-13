const {Schema, model} = require('mongoose')
const mongoose = require("mongoose");

const SpecialtyTranslateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    specialty: {
        type: Schema.Types.ObjectId,
        ref: 'department',
    },
    status: {
        type: Number,
        default: 1
    },
    price: {
        type: String,
    },
    duration: {
        type: String,
    },
    language: {
        type: Schema.Types.ObjectId,
        ref: 'language',
        required: true,
    }
})


module.exports = mongoose.model('specialtyTranslate', SpecialtyTranslateSchema);