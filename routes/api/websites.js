const express = require('express');
const router = express.Router();
const postWebsite = require('../../controllers/postWebsite');
const getWebsites = require('../../controllers/getWebsites');

router
    .route('/')
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

module.exports = router;
