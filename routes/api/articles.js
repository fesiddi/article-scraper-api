const express = require('express');
const router = express.Router();
const getAllArticles = require('../../controllers/articles/getAllArticles');
const { getArticles } = require('../../controllers/articles/getArticles');

router.get('/', async (req, res, next) => {
    // variable were all found articles will be stored
    let result;
    const siteName = req.query.siteName.toLowerCase();
    const keyword = req.query.keyword;
    if (!siteName || !keyword) {
        return res.status(400).json({ Error: 'A parameter is missing' });
    }
    try {
        if (siteName === 'all') {
            result = await getAllArticles(keyword);
        } else {
            result = await getArticles(siteName, keyword);
        }
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

module.exports = router;
