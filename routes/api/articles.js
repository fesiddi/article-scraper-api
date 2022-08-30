const express = require('express');
const { getArticles } = require('../../controllers/articles/getArticles');
const router = express.Router();

router.get('/', getArticles);

module.exports = router;
