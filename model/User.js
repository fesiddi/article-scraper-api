const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    role: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
