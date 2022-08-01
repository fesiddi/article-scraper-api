const config = require('./utils/config');
const app = require('./app');
const { connectDB } = require('./utils/dbConnection');
const mongoose = require('mongoose');

// connect to the mongoDB database
connectDB();

// once connected to the db we start the server
mongoose.connection.once('open', () => {
    console.log('Connected to the database');
    app.listen(config.PORT, () =>
        console.log(`Article Scraping App listening on port ${config.PORT}!`)
    );
});
