const mongoose = require('mongoose');
const { Schema } = mongoose;

const specialistInfoSchema = new Schema({
    files: {
        type: [String],
        default: []
    },
    articles: {
        type: [String],
        default: []
    },
    slug: {
        type: String,
    },
    img: [],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Number,
        default: 1
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('specialistInfo', specialistInfoSchema);

