const { Schema, model } = require('mongoose')

const Language = new Schema({
    title: {
        type: String,
        required: [true, 'Til nomini kiritish majburiy.']
    },
    slug: {
        type: String,
        unique:true,
        required: [true, 'Til turini qisqa korinishini kiritish majburiy (ru, uz, en)!']
    },
    isDefault:{
        type:Boolean,
        default: false
    },
    img: [],
    status: {
        type: Number,
        default: 1
    }
})

module.exports = model('language', Language);