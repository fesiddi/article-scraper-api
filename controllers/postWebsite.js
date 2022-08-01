const Website = require('../model/Website');
const URL = require('url').URL;
const axios = require('axios');

// function used to check if website is existent and valid by making a get request to the url
const verifyUrlExists = async (website) => {
    try {
        const response = await axios.get(website.toString(), { timeout: 1500 });
        if (response.status === 200) {
            return website;
        }
    } catch (err) {
        console.error(err.message);
    }
};

// function to convert url string to an url object
const stringToUrl = (urlString) => {
    try {
        const newUrl = new URL(urlString);
        return newUrl;
    } catch (err) {
        console.error('Error converting string to URL: ' + err.message);
    }
};

// function to post the website url to the database
const postWebsite = async (website) => {
    // first we convert website string to an url object
    const siteUrl = stringToUrl(website);

    // if formatting url didn't work, the input string in req.body.url is not in the right format
    if (!siteUrl) {
        const formatErr = new Error('Invalid url format');
        formatErr.code = 'Invalid url format';
        throw formatErr;
    }
    try {
        // here checks if url exists by making a get request to the url
        const urlExists = await verifyUrlExists(siteUrl);

        // if response.status of the get request is not 200
        if (!urlExists) {
            // we throw an error with the following code
            const urlError = new Error('Provided url does not exists');
            urlError.code = 'Provided url does not exists';
            throw urlError;
        }

        // if all previous checks have passed we try to create a new entry to the DB
        const result = await Website.create({
            url: urlExists,
        });
        return result;
    } catch (err) {
        throw err;
    }
};

module.exports = postWebsite;
