const Website = require('../../model/Website');
const { handleWebsites } = require('../websites/getWebsites');
const axios = require('axios');
const cheerio = require('cheerio');

// this function search in the db for a record with siteName as a name property
const findWebsiteRecord = async (siteName) => {
    const foundWebsite = await Website.findOne({
        siteName: siteName,
    }).exec();
    // if no record is found we throw an Error
    if (!foundWebsite) {
        const siteError = new Error('Website not found in db');
        siteError.name = 'siteError';
        throw siteError;
    }
    return foundWebsite.url;
};

// function to extract articles from an html string
// foundArticles will be returned as an array of objects with
// title: the article title containing the keyword
// url: link at the article
const extractArticlesFromHtml = (html, keyword, website) => {
    // first we load all html into cheerio parser
    const $ = cheerio.load(html);
    // array were found articles will be stored
    const foundArticles = [];
    // search strings with lowercase, capital case and uppercase version of keyword
    const searchStrings = [
        'a:contains("' + keyword.toLowerCase() + '")',
        'a:contains("' +
            keyword[0].toUpperCase() +
            keyword.substring(1).toLowerCase() +
            '")',
        'a:contains("' + keyword.toUpperCase() + '")',
    ];
    // here we search lowercase keyword and capital case keyword mapping the searchStrings array
    for (const searchString of searchStrings) {
        // here cheerio will search for all <a tags containing specified keyword
        $(searchString).each((i, el) => {
            const title = $(el).text();
            let url = $(el).attr('href');
            // Some articles href have no http prefix, if this is the case we add it using the website variable that store the website url
            if (url.startsWith('http') === false) {
                url = website + url;
            }
            foundArticles.push({
                title: title,
                url: url,
            });
        });
    }
    return foundArticles;
};

// main function for getting articles from with a specific keyword from a website in the db
const handleArticles = async (siteName, keyword) => {
    // calling findWebsiteRecord function defined before
    const website = await findWebsiteRecord(siteName);
    // using axios to make a get request and save the response object
    const response = await axios.get(website);
    // here we save the html from the response object
    const html = response.data;
    // then we pass the html and keyword to to extractArticles function
    const articles = extractArticlesFromHtml(html, keyword, website);
    return articles;
};

const handleAllArticles = async (keyword) => {
    let allArticles = [];
    const websites = await handleWebsites();
    for (const website of websites) {
        const foundArticles = await handleArticles(website.siteName, keyword);
        allArticles.push(...foundArticles);
    }
    return allArticles;
};

const removeDuplicateArticles = (articles) => {
    const uniqueArticles = Array.from(
        new Set(articles.map((article) => article.url))
    ).map((url) => {
        return articles.find((article) => article.url === url);
    });
    return uniqueArticles;
};

const getArticles = async (req, res, next) => {
    // variable were all found articles will be stored
    let result;
    const siteName = req.query.siteName.toLowerCase();
    const keyword = req.query.keyword;
    if (!siteName || !keyword) {
        return res.status(400).json({ Error: 'A parameter is missing' });
    }
    try {
        if (siteName === 'all') {
            result = await handleAllArticles(keyword);
        } else {
            result = await handleArticles(siteName, keyword);
        }
        if (result.length === 0) {
            return res.status(200).json({
                NoData: `Sorry, no articles with ${keyword} keyword were found`,
            });
        }
        result = removeDuplicateArticles(result);
        return res.status(200).json(result);
    } catch (err) {
        // passing error the to errorHandler middleware
        next(err);
    }
};

module.exports = { getArticles, extractArticlesFromHtml };
