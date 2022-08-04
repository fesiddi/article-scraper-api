const Website = require('../model/Website');
const URL = require('url').URL;
const axios = require('axios');

// function used to check if website is existent and valid by making a get request to the url
const verifyUrlExists = async (website) => {
    try {
        const response = await axios.get(website.toString(), {
            timeout: 1500,
        });
        if (response.status === 200) {
            return website;
        }
    } catch (err) {
        const timeoutError = new Error('Exceeded timeout for reaching website');
        timeoutError.name = 'timeoutError';
        throw timeoutError;
    }
};

// function to convert url string to an url object
const stringToUrl = (urlString) => {
    try {
        const newUrl = new URL(urlString);
        return newUrl;
    } catch (err) {
        const urlError = new Error(
            'Error converting string to URL, provide a valid url'
        );
        urlError.name = 'urlError';
        throw urlError;
    }
};

// function to post the website url to the database
const postWebsite = async (website) => {
    // first we convert website string to an url object
    const siteUrl = stringToUrl(website);
    try {
        // here checks if url exists by making a get request to the url
        const urlExists = await verifyUrlExists(siteUrl);
        // extracting the hostname part of the url
        let hostname = urlExists.host;
        // check if hostname contains www., if so we remove it
        if (hostname.indexOf('www.') === 0) {
            hostname = urlExists.host.replace('www.', '');
        }
        // then we remove the part after the dot from the hostname variable
        // ex: repubblica.it becomes repubblica
        hostname = hostname.split('.')[0];
        // if all previous checks have passed we try to create a new entry to the DB
        const result = await Website.create({
            url: urlExists,
            siteName: hostname,
        });
        return result;
    } catch (err) {
        throw err;
    }
};

module.exports = postWebsite;
