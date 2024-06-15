const express = require('express');
const router = express.Router();

const playlistController = require('../controllers/playlist');

router.get('/', playlistController.getPlaylists);
router.get('/:id', playlistController.getPlaylistSongById);
router.post('/', playlistController.createPlaylist);
router.post('/:id', playlistController.addPlaylistSong);
router.put('/:id', playlistController.updatePlaylistById);
router.delete('/:id', playlistController.deletePlaylistById);
router.delete('/:id/song', playlistController.deletePLaylistSong);
module.exports = router;