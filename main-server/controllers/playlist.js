const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const { Song, Playlist, PlaylistSong } = require('../models/playlistSong');
const { Artist } = require('../models/songArtist');

/**
 * get all playlists
 */
exports.getPlaylists = asyncHandler(async (req, res) => {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;
    // by attributes
    const title = req.query.title || '';

    const playlists = await Playlist.findAll({
        attributes: ['id', 'title'],
        where: {
            title: {[Op.substring]: title},
            userId: req.user.id
        },
        limit: limit,
        offset: (page-1)*limit
    });
    // get total of playlists
    const count = await Playlist.count({
        where: {
            title: {[Op.substring]: title},
            userId: req.user.id
        },
    });

    res.json({
        playlists,
        page: page,
        page_size: limit,
        total_page: Math.ceil(count/limit)
    });
});

/**
 * get specific playlist and songs in it
 */
exports.getPlaylistSongById = asyncHandler(async (req, res) => {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;

    const playlist = await Playlist.findByPk(req.params.id);

    if (!playlist) return res.json(null);

    const songsData = await Song.findAll({
        attributes: ['id', 'title', 'image'],
        include: {
            model: PlaylistSong,
            attributes: [],
            where: { playlistId: req.params.id }
        },
        order: [[PlaylistSong, 'createdAt', 'DESC']],
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
    // get total of songs
    const count = await Song.count({
        include: {
            model: PlaylistSong,
            attributes: [],
            where: { playlistId: req.params.id }
        }
    });

    res.json({
        playlist,
        songs,
        page: page,
        page_size: limit,
        total_page: Math.ceil(count/limit)
    });
});

/**
 * create new playlist
 */
exports.createPlaylist = asyncHandler(async (req, res) => {
    delete req.body.id;
    const playlist = Playlist.build({
        ...req.body,
        userId: req.user.id,
    });
    await playlist.save();
    res.json({ success: 'playlist created successfully' });
});

/**
 * insert song into playlist
 */
exports.addPlaylistSong = asyncHandler(async (req, res) => {
    const exists = await PlaylistSong.count({
        where: { playlistId: req.params.id, songId: req.body.songId }
    });

    if (exists) return res.status(400).json({ error: 'this song already exists in playlist' });

    await PlaylistSong.create({
        playlistId: req.params.id,
        songId: req.body.songId,
    });
    res.json({ success: 'song is added to playlist successfully' });
});

/**
 * update playlist by id
 */
exports.updatePlaylistById = asyncHandler(async (req, res) => {
    delete req.body.id;
    await Playlist.update(req.body, {
        where: { id: req.params.id }
    });
    res.json({ success: 'playlist updated successfully' });
});

/**
 * delete playlist by id
 */
exports.deletePlaylistById = asyncHandler(async (req, res) => {
    const exists = await Playlist.count({
        where: { id: req.params.id, userId: req.user.id }
    });
    if (!exists) return res.status(400).json({ error: 'this playlist does not exists' });

    await Playlist.destroy({
        where: { id: req.params.id, userId: req.user.id }
    });
    res.json({ success: 'playlist deleted successfully' });
});

/**
 * remove song from playlist
 */
exports.deletePLaylistSong = asyncHandler(async (req, res) => {
    const exists = await Playlist.count({
        where: { id: req.params.id, userId: req.user.id },
        include: {
            model: PlaylistSong,
            where: {
                songId: req.body.songId
            }
        }
    });
    if (!exists) return res.status(400).json({ error: 'song does not exists' });

    await PlaylistSong.destroy({
        where: { playlistId: req.params.id, songId: req.body.songId }
    });
    res.json({ success: 'song removed successfully'});
});