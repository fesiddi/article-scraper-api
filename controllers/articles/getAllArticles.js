const getWebsites = require('../websites/getWebsites');
const { getArticles } = require('./getArticles');

const getAllArticles = async (keyword) => {
    try {
        let allArticles = [];
        const websites = await getWebsites();
        for (const website of websites) {
            const foundArticles = await getArticles(website.siteName, keyword);
            allArticles.push(...foundArticles);
        }
        return allArticles;
    } catch (err) {
        throw err;
    }
};

module.exports = getAllArticles;
