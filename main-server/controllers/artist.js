const asyncHandler = require("express-async-handler");
const { Artist, Song } = require('../models/songArtist');
const { Op } = require('sequelize');

/**
 * get all artists
 */
exports.getArtists = asyncHandler(async (req, res) => {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;
    // by attributes
    const fullname = req.query.fullname || '';

    const artists = await Artist.findAll({
        where: {
            fullname: {[Op.substring]: fullname}
        },
        limit: limit,
        offset: (page-1)*limit
    });

    // get total of artists
    const count = await Artist.count({
        where: {
            fullname: {[Op.substring]: fullname}
        },
    });
    res.json({
        artists,
        page: page,
        page_size: limit,
        total_page: Math.ceil(count/limit)
    });
});

/**
 * get specific artist by id
 */
exports.getArtistById = asyncHandler(async (req, res) => {
    const artist = await Artist.findByPk(req.params.id);
    res.json(artist);
});

/**
 * get all songs of specific artist by artist_id
 */
exports.getArtistSongs = asyncHandler(async (req, res) => {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;

    const artist = await Artist.findByPk(req.params.id);
    if (!artist) return res.json(null);
    const songs = await Song.findAll({
        attributes: ['id', 'title', 'image'],
        limit: limit,
        offset: (page-1)*limit,
        include: {
            model: Artist,
            attributes: [],
            where: { id: req.params.id }
        },
    });
    // get total of songs
    const count = await Song.count({
        include: {
            model: Artist,
            attributes: [],
            where: { id: req.params.id }
        },
    });
    res.json({
        artist,
        songs,
        page: page,
        page_size: limit,
        total_page: Math.ceil(count/limit)
    });
});