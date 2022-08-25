const express = require('express');
const registerUser = require('../controllers/users/registerUser');
const router = express.Router();

router.post('/', registerUser);

module.exports = router;
