const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../model/User');
require('dotenv').config();

const handleLogin = async (req, res, next) => {
    const { user, password } = req.body;
    if (!user || !password) {
        return res
            .status(400)
            .json({ error: 'Username and password required!' });
    }
    try {
        const foundUser = await User.find({ username: user });
        if (!foundUser) {
            return res
                .status(401)
                .json({ Error: `Username ${user} not found` });
        }
        // if user is found in db we evaluate the password
        const match = await bcrypt.compare(password, foundUser.password);
        if (match) {
            // create JWT
            const accessToken = jwt.sign(
                {
                    username: foundUser.username,
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
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
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            // access token will be captured by the frontend
            return res.status(200).json({ accessToken });
        } else {
            return res.status(401); // Unauthorized
        }
    } catch (err) {
        next(err);
    }
};

module.exports = handleLogin;
