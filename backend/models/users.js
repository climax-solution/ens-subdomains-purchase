const { Schema, model } = require("mongoose");

const options = new Schema({
    address: {
        type: String,
        required: true,
        lowercase: true,
        min: 42
    }
}, {
    timestamps: true
});

module.exports = model('user', options);