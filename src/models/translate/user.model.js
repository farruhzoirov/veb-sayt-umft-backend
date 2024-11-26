const {Schema, model} = require("mongoose")

const UserTranslateSchema = new Schema({
    name: {
        type: String,
        required: [true, "User's name is required"],
    },
    text: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    language: {
        type: Schema.Types.ObjectId,
        ref: 'language',
    },

}, {
    timestamps: true
})

module.exports = model("userTranslate", UserTranslateSchema);
