const User = require('../../model/User');
const bcrypt = require('bcrypt');

const registerUser = async (req, res, next) => {
    const { user, password } = req.body;
    if (!user || !password) {
        return res
            .status(400)
            .json({ Error: 'Username and password required!' });
    }
    // check for duplicate usernames in db
    const duplicate = await User.find({ username: user });
    if (duplicate) {
        return res.status(409).json({ Error: 'Conflict' });
    }
    try {
        // using bcrypt to hash and salt password
        const hashPass = await bcrypt.hash(password, 10);
        // store new user
        const newUser = User.create({
            role: 'user',
            username: user,
            password: hashPass,
        });
        return res.status(201).json({ Success: `New user ${user} created!` });
    } catch (err) {
        next(err);
    }
};

module.exports = registerUser;
