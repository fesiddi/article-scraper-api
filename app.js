const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

app.use(
    cors({
        // origin: '',
    })
);

// middleware to handle json
app.use(express.json());

// middleware to handle url encoded form data
app.use(
    express.urlencoded({
        extended: false,
    })
);

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// home route
app.use('/', require('./routes/home'));

// api routes
app.use('/api/articles', require('./routes/api/articles'));
app.use('/api/websites', require('./routes/api/websites'));

// middleware for error handling
app.use(errorHandler);

module.exports = app;
