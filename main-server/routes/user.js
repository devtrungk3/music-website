const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/', userController.getInfo);
router.put('/', userController.updateInfo);
router.get('/for-you', userController.getSongsForYou)
router.get('/maybe-like', userController.getSongsMaybeLike)

module.exports = router;