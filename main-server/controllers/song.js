const asyncHandler = require('express-async-handler');
const { Song, Artist } = require('../models/songArtist');
const { Genre } = require('../models/songGenre');
const { Op } = require('sequelize');

/**
 * get all songs
 */
exports.getSongs = asyncHandler(async (req, res) => {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;
    // by attributes
    const title = req.query.title || '';

    const songs = await Song.findAll({
        where: {
            title: {[Op.substring]: title}
        },
        attributes: ['id', 'title', 'image'],
        limit: limit,
        offset: (page-1)*limit
    });
    // get total of songs
    const count = await Song.count({
        where: {
            title: {[Op.substring]: title}
        },
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
    res.json({
        songs,
        page: page,
        page_size: limit,
        total_page: Math.ceil(count/limit)
    });
});

/**
 * get specific song by id
 */
exports.getSongById = asyncHandler(async (req, res) => {
    const song = await Song.findByPk(req.params.id);
    if (!song) return res.json(null);
    const artists = await Artist.findAll({
        attributes: ['id', 'fullname'],
        include: {
            model: Song,
            attributes: [],
            where: { id: req.params.id }
        }
    });
    const genres = await Genre.findAll({
        attributes: ['id', 'title'],
        include: {
            model: Song,
            attributes: [],
            where: { id: req.params.id }
        }   
    });
    res.json({
        song,
        artists: artists,
        genres: genres
    });
});