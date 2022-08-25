const express = require('express');
const router = express.Router();
const handleRefreshToken = require('../controllers/users/refreshToken');

router.post('/', handleRefreshToken);

module.exports = router;
