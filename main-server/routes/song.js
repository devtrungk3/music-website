const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/jwtVerification');
const songController = require('../controllers/song');

router.get('/', songController.getSongs);
router.get('/for-you', verifyJWT, songController.getSongsForYou)
router.get('/maybe-like', verifyJWT, songController.getSongsMaybeLike)
router.get('/:id', songController.getSongById);

module.exports = router;