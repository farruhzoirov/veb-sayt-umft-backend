const { Schema, model } = require("mongoose")

const CategoryTranslateSchema = new Schema({
    title: {
        type: String,
        required: [true, "The CategoryName field must not be empty."]
    },
    text: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
    },
    language: {
        type: Schema.Types.ObjectId,
        ref: 'language',
    },

}, { timestamps: true })


CategoryTranslateSchema.index({ title: 1 });

module.exports = model("categoryTranslate", CategoryTranslateSchema);
