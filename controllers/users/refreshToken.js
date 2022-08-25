const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../model/User');
require('dotenv').config();

const handleRefreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    // if there cookies do not exists or there isn't jwt cookie
    if (!cookies?.jwt) {
        return res.status(401);
    }
    try {
        const refreshToken = cookies.jwt;
        const foundUser = await User.find({ refreshToken: refreshToken });
        if (!foundUser) {
            return res.status(403); // Forbidden
        }
        // if refreshToken is found in db we evaluate the jwt
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.username !== decoded.username) {
                    return res.sendStatus(403);
                }
                const accessToken = jwt.sign(
                    {
                        username: decoded.username,
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30s' }
                );
            }
        );
        const match = await bcrypt.compare(password, foundUser.password);
    } catch (err) {
        next(err);
    }
};

module.exports = handleRefreshToken;
