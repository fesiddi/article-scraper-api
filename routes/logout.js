const express = require('express');
const router = express.Router();
const logoutUser = require('../controllers/users/logoutUser');

router.get('/', logoutUser);

module.exports = router;
