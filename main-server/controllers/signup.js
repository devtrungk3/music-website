const asyncHandler = require('express-async-handler');
const jwtUtil = require('../utils/jwt');
const User = require('../models/user');

const userSignupController = asyncHandler(async (req, res) => {
    const { username, password, fullname, email } = req.body;
    const role = "USER";
    /**
     * check data exists in database
     */
    const usernameExists = await User.findOne({ where: { username: username } });
    if (usernameExists) {
        return res.status(409).json({ error: 'username already in use!'});
    }
    const emailExists = await User.findOne({ where: { email: email } });
    if (emailExists) {
        return res.status(409).json({ error: 'email already in use!'});
    }

    /**
     * insert new records into users table
     */
    await User.create({
        username,
        password,
        fullname,
        email,
        role,
    });

    const user = await User.findOne({
        where: { username },
        attributes: ['id', 'username', 'role'],
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

module.exports = { userSignupController };