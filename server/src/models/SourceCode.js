const mongoose = require('mongoose');

const sourceCodeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        default: 'Khác'
    },
    thumbnail: {
        type: String,
        default: ''
    },
    demoImages: [{
        type: String
    }],
    filePath: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('SourceCode', sourceCodeSchema, "source_codes");
