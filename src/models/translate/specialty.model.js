const {Schema} = require('mongoose')
const mongoose = require("mongoose");


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
    specialty: {
        type: Schema.Types.ObjectId,
        ref: 'specialty',
    },
    language: {
        type: Schema.Types.ObjectId,
        ref: 'language',
        required: true,
    }
})


module.exports = mongoose.model('specialtyTranslate', SpecialtyTranslateSchema);