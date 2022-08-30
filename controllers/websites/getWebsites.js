const Website = require('../../model/Website');

const handleWebsites = async () => {
    result = await Website.find({}).exec();
    return result;
};

const getWebsites = async (req, res, next) => {
    try {
        websitesList = await handleWebsites();
        if (websitesList.length === 0) {
            return res.status(200).json({
                NoData: `Sorry, websites database is empty`,
            });
        }
        return res.status(200).json(websitesList);
    } catch (err) {
        // passing error the to errorHandler middleware
        next(err);
    }
};

module.exports = { getWebsites, handleWebsites };
