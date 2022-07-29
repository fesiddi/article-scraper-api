const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

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
app.use('/', require('./routes/root'));

// api routes
app.use('/api', require('./routes/api/api'));

module.exports = app;
