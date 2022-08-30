const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401); // Unauthorized
        const rolesArray = [...allowedRoles];
        // at this point we check if the user has the rights to access resource
        // by checking the req.roles variable in the jwt and confronting it with the allowedRoles array
        const result = rolesArray.includes(req.roles);
        if (!result) res.sendStatus(401); // Unauthorized
        next();
    };
};

module.exports = verifyRole;
