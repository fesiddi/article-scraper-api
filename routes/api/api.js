const express = require('express');
const router = express.Router();
const postWebsite = require('../../controllers/postWebsite');
const { getArticles } = require('../../controllers/getArticles');
const getWebsites = require('../../controllers/getWebsites');

router
    .route('/websites')
    .get(async (req, res, next) => {
        try {
            websitesList = await getWebsites();
            if (websitesList.length === 0) {
                return res.status(200).json({
                    NoData: `Sorry, websites database is empty`,
                });
            }
            return res.status(200).json(websitesList);
        } catch (err) {
            // passing error the to errorHandler middleware
            next(err);
        }
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

router.get('/articles/', async (req, res, next) => {
    const siteName = req.query.siteName;
    const keyword = req.query.keyword;
    if (!siteName || !keyword) {
        return res.status(400).json({ Error: 'A parameter is missing' });
    }
    try {
        const result = await getArticles(siteName, keyword);
        if (result.length === 0) {
            return res.status(200).json({
                NoData: `Sorry, no articles with ${keyword} keyword were found`,
            });
        }
        return res.status(200).json(result);
    } catch (err) {
        // passing error the to errorHandler middleware
        next(err);
    }
});

// OLD ENDPOINT FOR GETTING ARTICLES
// router.get('/websites/:siteName/:keyword', async (req, res, next) => {
//     const siteName = req.params.siteName;
//     const keyword = req.params.keyword;
//     if (!siteName || !keyword) {
//         return res.status(400).json({ Error: 'A parameter is missing' });
//     }
//     try {
//         const result = await getArticles(siteName, keyword);
//         return res.status(200).json(result);
//     } catch (err) {
//         // passing error the to errorHandler middleware
//         next(err);
//     }
// });

module.exports = router;
