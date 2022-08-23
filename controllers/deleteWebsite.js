const Website = require('../model/Website');

const deleteWebsite = async (siteName) => {
    try {
        const result = await Website.deleteOne({ siteName: siteName });
        if (result.deletedCount === 1) {
            return result;
        }
        return null;
    } catch (err) {
        throw err;
    }
};

module.exports = deleteWebsite;
