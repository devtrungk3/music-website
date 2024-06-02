const express = require('express');
const { renewAccessToken } = require('../utils/jwt');
const asyncHandler = require('express-async-handler');
const router = express.Router();

router.post('/refresh', asyncHandler(async (req, res) => {
    const {refreshToken} = req.cookies;
    if (!refreshToken) return res.status(400).json({ error: 'Not found refresh token'});
    const accessToken = await renewAccessToken(refreshToken);
    res.json({accessToken});
}));

module.exports = router;