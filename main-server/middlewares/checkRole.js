function checkRole(allowRole) {
    return (req, res, next) => {
        if (!req.user || !allowRole.includes(req.user.role)) return res.status(401).json('You are not allowed');
        next();
    }
}

module.exports = { checkRole };