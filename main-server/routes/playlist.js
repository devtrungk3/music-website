const express = require('express');
const router = express.Router();

const playlistController = require('../controllers/playlist');
const { verifyJWT } = require('../middlewares/jwtVerification');

router.get('/', verifyJWT, playlistController.getPlaylists);
router.get('/:id', verifyJWT, playlistController.getPlaylistSongById);
router.post('/', verifyJWT, playlistController.createPlaylist);
router.post('/:id', verifyJWT, playlistController.addPlaylistSong);
router.put('/:id', verifyJWT, playlistController.updatePlaylistById);
router.delete('/:id', verifyJWT, playlistController.deletePlaylistById);
router.delete('/:id/song', verifyJWT, playlistController.deletePLaylistSong);
module.exports = router;