const express = require('express');
const router = express.Router();
const logoutUser = require('../controllers/users/logoutUser');

router.post('/', logoutUser);

module.exports = router;
