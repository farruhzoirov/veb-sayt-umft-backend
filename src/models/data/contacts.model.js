const mongoose = require('mongoose');

const ContactsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('contact', ContactsSchema);



