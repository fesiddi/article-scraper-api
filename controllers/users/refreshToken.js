const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../model/User');
require('dotenv').config();

const handleRefreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    // if cookies do not exists or there isn't jwt cookie
    if (!cookies?.jwt) {
        return res.sendStatus(401); // Unauthorized
    }
    try {
        const refreshToken = cookies.jwt;
        const foundUser = await User.findOne({
            refreshToken: refreshToken,
        }).exec();
        if (!foundUser) {
            return res.sendStatus(403); // Forbidden
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
                        UserInfo: {
                            username: decoded.username,
                            role: decoded.role,
                        },
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '60s' }
                );
                res.json({ accessToken });
            }
        );
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = handleRefreshToken;
