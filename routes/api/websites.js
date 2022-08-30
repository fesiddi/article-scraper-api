const express = require('express');
const router = express.Router();
const ROLES_LIST = require('../../utils/roles_list');
const verifyRole = require('../../middleware/verifyRole');
const postWebsite = require('../../controllers/websites/postWebsite');
const { getWebsites } = require('../../controllers/websites/getWebsites');
const deleteWebsite = require('../../controllers/websites/deleteWebsite');

router
    .route('/')
    .get(getWebsites)
    .post(verifyRole(ROLES_LIST.Admin), postWebsite);

router.route('/:siteName').delete(verifyRole(ROLES_LIST.Admin), deleteWebsite);

module.exports = router;
