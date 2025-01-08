const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const SocialSetSchema = new Schema(
    {
        messenger: {
            type: Schema.Types.ObjectId,
            ref: 'messenger',
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        employee: {
            type: Schema.Types.ObjectId,
            ref: 'employee',
            default: null,
        },
        university: {
            type: Boolean,
            default: true,
        },
        status: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("employee", SocialSetSchema);
