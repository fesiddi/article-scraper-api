const User = require('../../model/User');
const bcrypt = require('bcrypt');

const registerUser = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({ Error: 'Username and password required!' });
    }
    // check for duplicate usernames in db
    const duplicate = await User.findOne({ username: username });
    if (duplicate) {
        return res.status(409).json({ Error: 'Conflict' });
    }
    try {
        // using bcrypt to hash and salt password
        const hashPass = await bcrypt.hash(password, 10);
        // store new username
        const newUser = await User.create({
            role: 1201,
            username: username,
            password: hashPass,
        });
        return res
            .status(201)
            .json({ Success: `New username ${username} created!` });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = registerUser;
