const Website = require('../../model/Website');

const getWebsites = async () => {
    result = await Website.find({}).exec();
    return result;
};

module.exports = getWebsites;
