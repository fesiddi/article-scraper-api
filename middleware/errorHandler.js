const errorHandler = (error, req, res, next) => {
    // this part check for duplicate key error code
    if (error.code === 11000) {
        return res.status(409).json({
            Error: 'Conflict, url is already present in the DB',
        });
    } else if (error.name === 'timeoutError') {
        return res.status(404).json({
            Error: error.message,
        });
    } else if (error.name === 'valueError') {
        return res.status(404).json({
            Error: error.message,
        });
    } else if (error.name === 'siteError') {
        return res.status(404).json({
            Error: error.message,
        });
    } else {
        return res.status(400).json({
            Error: error.message,
        });
    }
};

module.exports = errorHandler;
