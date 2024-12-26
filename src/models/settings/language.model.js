const {Schema, model} = require('mongoose')

const LanguageModel = new Schema({
    title: {
        type: String,
        required: [true, 'Language title is required'],
    },
    slug: {
        type: String,
        required: [true, 'Language type must be like that (ru, uz, en)!']
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    img: [],
    status: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
})

module.exports = model('language', LanguageModel);