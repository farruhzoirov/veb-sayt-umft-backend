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
    }
})

module.exports = mongoose.model('contact', ContactsSchema);



