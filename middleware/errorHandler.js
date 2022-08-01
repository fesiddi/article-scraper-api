const errorHandler = (error, req, res, next) => {
    // this part check for duplicate key error code
    if (error.code === 11000) {
        return res.status(409).json({
            error: 'Conflict, url is already present in the DB',
        });

        // this part check for error of url format of the req.body.url
    } else if (error.code === 'Invalid url format') {
        return res.status(400).json({
            error: 'Please provide url in the format of http://www.example.com',
        });

        // this part check for error if website does not exist
    } else if (error.code === 'Provided url does not exists') {
        return res.status(404).json({
            error: 'Please provide an existing url',
        });
    }
};

module.exports = errorHandler;
