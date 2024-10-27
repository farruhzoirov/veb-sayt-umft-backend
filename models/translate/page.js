const { Schema, model } = require("mongoose");

const PageTranslateSchema = new Schema({
    title: String,
    text:String,
    description:String,
    page: {
        type: Schema.Types.ObjectId,
        ref: 'page'
    },
    language: {
        type: Schema.Types.ObjectId,
        ref: 'news'
    },
    status: {
        type: Number,
        default: 0
    },
}, { timestamps: true })

module.exports = model("pageTranslate", PageTranslateSchema);