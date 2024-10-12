const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    authors: {
        type: String,
        required: true
    },
    favorite: {
        type: Number,
        required: true
    },
    fileCover: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileBook: {
        type: String,
        required: true
    },
    pathTemp: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Express', BookSchema);

