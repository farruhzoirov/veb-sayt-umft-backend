const mongoose = require('mongoose');

const ContactsSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
        },
        phone: {
          type: String
        },
        slug: {
            type: String,
            required: [true, "Slug is required"]
        },
        location: [{
            lang: String,
            lat: String
        }],
        address: [],
        img: []
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('contact', ContactsSchema);



