const Website = require('../../model/Website');

const handleDelete = async (siteName) => {
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

const deleteWebsite = async (req, res, next) => {
    const siteName = req.params.siteName.toLowerCase();
    try {
        if (siteName) {
            const deletedWebsite = await handleDelete(siteName);
            if (deletedWebsite) {
                return res.status(200).json({
                    Success: `Website ${siteName} successfully deleted!`,
                });
            }
            return res.status(404).json({
                Error: `Can't delete ${siteName}. Website not found in database.`,
            });
        }
    } catch (err) {
        // passing error to the errorHandler middleware
        next(err);
    }
};

module.exports = deleteWebsite;
