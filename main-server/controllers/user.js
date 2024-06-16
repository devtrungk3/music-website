const asyncHandler = require('express-async-handler');

const User = require('../models/user');
const { Song, Artist } = require('../models/songArtist');
const { Op } = require('sequelize');
const axios = require('axios');

/**
 * get information about user
 */
exports.getInfo = asyncHandler(async(req, res) => {
    const user = await User.findOne({
        attributes: ['username', 'email', 'fullname'],
        where: { id: req.user.id }
    });
    res.json(user);
});

/**
 * update user's information
 */
exports.updateInfo = asyncHandler(async (req, res) => {
    delete req.body.id
    delete req.body.username
    delete req.body.role
    const {email} = req.body;
    if (email) {
        const exists = await User.count({
            where: { email }
        });
        if (exists != 0) {
            return res.status(400).json({ error: 'email is already in use by another user'})
        }
    }
    await User.update(req.body, {
        where: { id: req.user.id }
    });
    res.json({ success: 'information updated successfully' });
});

/**
 * recommend song - content-based filtering
 */
exports.getSongsForYou = asyncHandler(async (req, res) => {
    try {
        const response = await axios.get(`http://127.0.0.1:5000/for-you/${req.user.id}`);
        const songs = await Song.findAll({
            where: {
                id: {[Op.in]: response.data.songs}
            },
            attributes: ['id', 'title', 'image']
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
        res.json(songs)
    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Server error'})
    }
});

/**
 * recommend song - collaborative filtering
 */
exports.getSongsMaybeLike = asyncHandler(async (req, res) => {
    try {
        const response = await axios.get(`http://127.0.0.1:5000/maybe-like/${req.user.id}`);
        const songs = await Song.findAll({
            where: {
                id: {[Op.in]: response.data.songs}
            },
            attributes: ['id', 'title', 'image']
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
        res.json(songs)
    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Server error'})
    }
});