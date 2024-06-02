const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    /**
     * first check request headers has authorized or not
     */
    if (!req.headers['authorization']) {
        return res.status(400).json({ error : 'No token provider!' });
    }
    /**
     * extract the jwt token from request headers 
     */
    const authorization = req.headers['authorization'].split(' ');
    if (authorization[0] !== 'Bearer') return res.status(400).json({ error: 'Invalid Bearer token!'});
    /**
     * verify the JWT token
     */
    jwt.verify(authorization[1], process.env.SECRET_ACCESS_KEY, (err, decoded) => {
        if (err) {
            console.log(err);
            res.status(401).json({ error: "Invalid token!" });
        } else {
            req.user = decoded;
            next();
        }
    });
};

module.exports = { verifyJWT };