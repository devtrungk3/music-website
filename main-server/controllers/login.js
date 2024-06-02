const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const jwtUtil = require('../utils/jwt');

const userLoginController = asyncHandler(async (req, res) => {
    const {username, password} = req.body;
    /**
     * get user information from database
     */
    const user = await User.findOne({
        where: { username, password },
        attributes: ['id', 'username', 'role'],
    });
    /**
     * check wrong credentials
     */
    if (!user) 
        return res.status(401).json({
            error: 'username or password is wrong!'
        });
    /**
     * create new access and refresh token using credentials
     */
    const accessToken = jwtUtil.generateAccessToken({
        id: user.id,
        username: user.username,
        role: user.role
    });
    const refreshToken = jwtUtil.generateRefreshToken({
        id: user.id,
        username: user.username,
        role: user.role    
    });

    /**
     * set the refresh token in the cookies of the response object with an expiry of 24 hours 
     * and send the response back to the client with the refresh token in the cookies
     */
    res
        .cookie('refreshToken', refreshToken, {
            expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
        })
        .json({accessToken});
});

module.exports = { userLoginController };