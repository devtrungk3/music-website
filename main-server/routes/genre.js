const express = require('express');
const router = express.Router();

const genreController = require('../controllers/genre');

router.get('/', genreController.getGenres);
router.get('/:id', genreController.getGenreById);
router.get('/:id/songs', genreController.getGenreSongs);

module.exports = router;