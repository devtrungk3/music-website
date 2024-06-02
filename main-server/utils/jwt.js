const jwt = require('jsonwebtoken');

/**
 * function to generate JWT access token
 */
const generateAccessToken = (payload) => {
    return jwt.sign(
        {...payload},
        process.env.SECRET_ACCESS_KEY,
        {
            expiresIn: '5m',
        }
    );
}
/**
 * 
 * // function to generate JWT refresh token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(
        {...payload},
        process.env.SECRET_REFRESH_KEY,
        {
            expiresIn: '24h',
        }
    );
}

/**
 * 
 * function to renew JWT access token using refresh token
 * 
 */
const renewAccessToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.SECRET_REFRESH_KEY, (err, decoded) => {
            if (err) {
                console.log('failed to renew access token');
                reject(err);
            } else {
                resolve(generateAccessToken({
                    id: decoded.id,
                    username: decoded.username,
                    role: decoded.role
                }));
            }
        })
    }); 
}

module.exports = { generateAccessToken, generateRefreshToken, renewAccessToken };