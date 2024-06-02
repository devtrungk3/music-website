const asyncHandler = require('express-async-handler');
const { Genre, Song } = require('../models/songGenre');
const { Artist } = require('../models/songArtist');
const { Op } = require('sequelize');

/**
 * get all genres
 */
exports.getGenres = asyncHandler(async (req, res) => {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;
    // by attributes
    const title = req.query.title || '';

    const genres = await Genre.findAll({
        where: {
            title: {[Op.substring]: title}
        },
        limit: limit,
        offset: (page-1)*limit
    });
    // get total of genres
    const count = await Genre.count({
        where: {
            title: {[Op.substring]: title}
        },
    });
    res.json({
        genres,
        page: page,
        page_size: limit,
        total_page: Math.ceil(count/limit)
    });
});

/**
 * get specific genre by id
 */
exports.getGenreById = asyncHandler(async (req, res) => {
    const genre = await Genre.findByPk(req.params.id);
    res.json(genre);
});

/**
 * get all songs of specific genre by genreId
 */
exports.getGenreSongs = asyncHandler(async (req, res) => {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;
    
    // get genre
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) return res.json(null);
    // get songs by genre
    const songs = await Song.findAll({
        attributes: ['id', 'title', 'image'],
        limit: limit,
        offset: (page-1)*limit,
        include: {
            model: Genre,
            attributes: [],
            where: { id: req.params.id }
        }
    });
    // get artists of each song
    const artistsPromises = songs.map(async (song) => {
        const artists = await Artist.findAll({
            attributes: ['id', 'fullname'],
            include: {
                model: Song,
                attributes: [],
                where: { id: song.id }
            }
        });
        return artists;
    });

    const artistsData = await Promise.all(artistsPromises);

    // map artistData to songs
    songs.forEach((song, index) => {
        song.dataValues.artists = artistsData[index];
    });
    // get total of songs
    const count = await Song.count({
        include: {
            model: Genre,
            attributes: [],
            where: { id: req.params.id }
        }
    });
    res.json({
        genre,
        songs,
        page: page,
        page_size: limit,
        total_page: Math.ceil(count/limit)
    });
});