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

// middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// home route
app.use('/', require('./routes/home'));

// user managing routes
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// JTW middleware
app.use(verifyJWT);
// api routes
app.use('/api/index', require('./routes/api/index'));
app.use('/api/articles', require('./routes/api/articles'));
app.use('/api/websites', require('./routes/api/websites'));

// middleware for error handling
app.use(errorHandler);

module.exports = app;
