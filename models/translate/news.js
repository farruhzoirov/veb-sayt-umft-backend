const { Schema, model } = require("mongoose");

const NewsTranslateSchema = new Schema({
    title: String,
    text:String,
    description:String,
    news: {
        type: Schema.Types.ObjectId,
        ref: 'news'
    },
    language: {
        type: Schema.Types.ObjectId,
        ref: 'language'
    },
    status: {
        type: Number,
        default: 0
    },
}, { timestamps: true })

module.exports = model("newsTranslate",  NewsTranslateSchema);