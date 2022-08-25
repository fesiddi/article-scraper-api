const express = require('express');
const authUser = require('../controllers/users/authUser');
const router = express.Router();

router.post('/', authUser);

module.exports = router;
