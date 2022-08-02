const express = require('express');
const router = express.Router();
const postWebsite = require('../../controllers/postWebsite');
const { getArticles } = require('../../controllers/getArticles');

router
    .route('/websites')
    .get((req, res, next) => {
        // controller for returning all websites present in the db
    })
    .post(async (req, res, next) => {
        const siteUrl = req.body.url;
        if (!siteUrl) {
            return res.status(400).json({ error: 'Url field is missing' });
        }
        try {
            const result = await postWebsite(siteUrl);
            return res.status(201).json(result);
        } catch (err) {
            // passing error the to errorHandler middleware
            next(err);
        }
    });

router.get('/websites/:siteName/:keyword', async (req, res, next) => {
    // controller for scraping keyword from website
    const siteName = req.params.siteName;
    const keyword = req.params.keyword;
    if (!siteName || !keyword) {
        return res.status(400).json({ Error: 'A parameter is missing' });
    }
    try {
        const result = await getArticles(siteName, keyword);
        return res.status(200).json(result);
    } catch (err) {
        // passing error the to errorHandler middleware
        next(err);
    }
});

module.exports = router;
