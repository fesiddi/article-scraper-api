const express = require('express');
const router = express.Router();
const postWebsite = require('../../controllers/postWebsite');

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

router.get('/websites/:id/:keyword', (req, res) => {
    // controller for scraping keyword from website
});

module.exports = router;
