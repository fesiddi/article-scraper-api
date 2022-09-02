const express = require('express');
const router = express.Router();
const ROLES_LIST = require('../../utils/roles_list');
const verifyRole = require('../../middleware/verifyRole');
const verifyJWT = require('../../middleware/verifyJWT');
const postWebsite = require('../../controllers/websites/postWebsite');
const { getWebsites } = require('../../controllers/websites/getWebsites');
const deleteWebsite = require('../../controllers/websites/deleteWebsite');

router.route('/').get(getWebsites).post(postWebsite);

router.route('/:siteName').delete(verifyRole(ROLES_LIST.Admin), deleteWebsite);

module.exports = router;
