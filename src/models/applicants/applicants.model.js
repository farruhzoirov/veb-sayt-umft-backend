const { Schema, model } = require("mongoose");

const ApplicantsSchema = new Schema({
    slug: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

module.exports = model("applications", ApplicantsSchema);