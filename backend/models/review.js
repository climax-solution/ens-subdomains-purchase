const { Schema, model } = require("mongoose");

const Review = new Schema({
    from: {
        type: String,
        lowercase: true
    },
    to: {
        type: String,
        lowercase: true
    },
    name: {
        type: String
    },
    star: {
        type: Number,
        default: 0
    },
    comment: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = model('Review', Review);