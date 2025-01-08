const mongoose = require('mongoose');

const ContactsSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: [true, "Slug is required"]
        },
        location: {
            lang: String,
            lat: String
        },
        address: {
            type: String,
        },
        img: []
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('contact', ContactsSchema);



