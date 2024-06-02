const express = require('express');
const router = express.Router();

const artistController = require('../controllers/artist');

router.get('/', artistController.getArtists);
router.get('/:id', artistController.getArtistById);
router.get('/:id/songs', artistController.getArtistSongs);

module.exports = router;