const User = require('../../model/User');
const jwt = require('jsonwebtoken');

const logoutUser = async (req, res, next) => {
    // here we also have to delete the access token on the frontend
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204); // no content
    }
    const refreshToken = cookies.jwt;
    try {
        // here we search for the refresh token in db
        const foundUser = await User.findOne({
            refreshToken: refreshToken,
        }).exec();
        if (!foundUser) {
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
            });
            return res.sendStatus(204);
        }
        // if refresh token is found in db, we delete it
        await User.updateOne(
            { username: foundUser.username },
            { refreshToken: '' }
        );
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        return res.sendStatus(204);
    } catch (err) {
        console.log(err.stack);
        next(err);
    }
};

module.exports = logoutUser;
