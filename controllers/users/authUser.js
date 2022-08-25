const bcrypt = require('bcrypt');
const User = require('../../model/User');

const authUser = async (req, res, next) => {
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
            // TODO: create JWT
            return res.status(200).json({ Success: `User ${user} logged in!` });
        } else {
            return res.status(401); // Unauthorized
        }
    } catch (err) {
        next(err);
    }
};
