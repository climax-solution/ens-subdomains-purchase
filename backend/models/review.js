const { Schema, model } = require("mongoose");

const Review = new Schema({
    from: {
        type: String
    },
    to: {
        type: String
    },
    rate: {
        type: Number
    },
    comment: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = model('Review', Review);