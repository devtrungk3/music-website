const asyncHandler = require("express-async-handler");
const { Song, Favorite } = require('../models/favorite');
const { Artist } = require('../models/songArtist');
const { Op } = require('sequelize');

/**
 * get favorite list
 */
exports.getSongs = asyncHandler(async (req, res) => {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;
    // by attributes
    const title = req.query.title || '';

    const songsData = await Song.findAll({
        attributes: ['id', 'title', 'image'],
        where: {
            title: {[Op.substring]: title}
        },
        include: {
            model: Favorite,
            attributes: [],
            where: { userId: req.user.id },
        },
        order: [[Favorite, 'createdAt', 'DESC']],
    });

    // apply pagination after fetching all songs
    const songs = songsData.slice((page - 1) * limit, page * limit);

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

    const count = await Song.count({
        include: {
            model: Favorite,
            attributes: [],
            where: { userId: req.user.id },
        },
    });

    res.json({
        songs,
        page: page,
        page_size: limit,
        total_page: Math.ceil(count/limit)
    });
});

/**
 * insert song into favorite list
 */
exports.addSongById = asyncHandler(async (req, res) => {
    const songId = req.body.songId;

    const exists = await Favorite.count({
        where: { userId: req.user.id, songId: songId }
    });
    if (exists) return res.status(400).json('This song already favorited');

    await Favorite.create({userId: req.user.id, songId: songId});

    res.json('Added song into favorite list');
});

/**
 * remove song from favorite list by songId
 */
exports.removeSongById = asyncHandler(async (req, res) => {
    const songId = req.params.songId;

    const exists = await Favorite.count({
        where: { userId: req.user.id, songId: songId }
    });
    if (!exists) return res.status(400).json({ error: 'This song does not exists in favorite list' });
    
    await Favorite.destroy({
        where: {
            userId: req.user.id,
            songId: songId,
        }
    });

    res.json('Removed song from favorite list');
});