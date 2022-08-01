const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.DB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
    } catch (err) {
        console.error(err);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

module.exports = { connectDB, disconnectDB };
