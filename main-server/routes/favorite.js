const express = require('express');
const router = express.Router();

const favoriteController = require('../controllers/favorite');
const { verifyJWT } = require('../middlewares/jwtVerification');

router.get('/', verifyJWT , favoriteController.getSongs);
router.post('/', verifyJWT , favoriteController.addSongById);
router.delete('/:songId', verifyJWT, favoriteController.removeSongById)

module.exports = router;