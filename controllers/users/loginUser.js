const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../model/User');
require('dotenv').config();

const handleLogin = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({ error: 'Username and password required!' });
    }
    try {
        const foundUser = await User.findOne({ username: username }).exec();
        if (!foundUser) {
            return res
                .status(401)
                .json({ Error: `Username ${username} not found` });
        }
        // if user is found in db we evaluate the password
        const match = await bcrypt.compare(password, foundUser.password);
        if (match) {
            // create JWT
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: foundUser.username,
                        role: foundUser.role,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '60s' }
            );
            const refreshToken = jwt.sign(
                {
                    username: foundUser.username,
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            // Saving refreshToken in the current user record
            const updatedUser = await User.updateOne(
                { username: foundUser.username },
                { refreshToken: refreshToken }
            );
            // create secure cookie with refresh token
            res.cookie('jwt', refreshToken, {
                httpOnly: true, // only accessible by a web server
                secure: true, // https
                sameSite: 'None', // cross-site cookie
                maxAge: 24 * 60 * 60 * 1000, // same of refreshToken
            });
            // access token will be captured by the frontend
            res.json({ accessToken });
        } else {
            return res.sendStatus(401); // Unauthorized
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = handleLogin;
