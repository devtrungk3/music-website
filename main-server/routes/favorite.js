const express = require('express');
const router = express.Router();

const favoriteController = require('../controllers/favorite');

router.get('/', favoriteController.getSongs);
router.post('/', favoriteController.addSongById);
router.delete('/:songId', favoriteController.removeSongById)

module.exports = router;