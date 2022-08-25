const express = require('express');
const path = require('path');
const app = express();
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

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
// register user route
app.use('/register', require('./routes/register'));
// user authorization route
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));

// JTW middleware
app.use(verifyJWT);
// api routes
app.use('/api/articles', require('./routes/api/articles'));
app.use('/api/websites', require('./routes/api/websites'));

// middleware for error handling
app.use(errorHandler);

module.exports = app;
