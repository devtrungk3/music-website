const asyncHandler = require('express-async-handler');

const User = require('../models/user');

/**
 * get information about user
 */
exports.getInfo = asyncHandler(async(req, res) => {
    const user = await User.findOne({
        attributes: ['username', 'email', 'fullname'],
        where: { id: req.user.id }
    });
    res.json(user);
});

/**
 * update user's information
 */
exports.updateInfo = asyncHandler(async (req, res) => {
    delete req.body.id
    delete req.body.username
    delete req.body.role
    const {email} = req.body;
    if (email) {
        const exists = await User.count({
            where: { email }
        });
        if (exists != 0) {
            return res.status(400).json({ error: 'email is already in use by another user'})
        }
    }
    await User.update(req.body, {
        where: { id: req.user.id }
    });
    res.json({ success: 'information updated successfully' });
});