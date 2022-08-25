const express = require('express');
const handleLogin = require('../controllers/users/loginUser');
const router = express.Router();

router.post('/', handleLogin);

module.exports = router;
