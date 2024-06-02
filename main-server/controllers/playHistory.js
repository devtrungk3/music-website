const asyncHandler = require("express-async-handler");
const { User, Song, PlayHistory } = require('../models/playHistory');
const { Artist } = require('../models/songArtist');

/**
 * get history
 */
exports.getHistory = asyncHandler(async (req, res) => {
    const songsData = await Song.findAll({
        attributes: ['id', 'title', 'image'],
        include: {
            model: PlayHistory,
            attributes: [],
            where: { userId: req.user.id },
        },
        order: [
            [PlayHistory, 'updatedAt', 'DESC'],
            [PlayHistory, 'createdAt', 'DESC']
        ],
    });

    // limit 10 songs
    const songs = songsData.slice(0, 10);

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

    res.json(songs);
});

exports.addHistory = asyncHandler(async (req, res) => {
    const songId = req.body.songId;

    const playCount = await PlayHistory.findOne({
        attributes: ['playCount'],
        where: { userId: req.user.id, songId: songId }
    });
    if (playCount) {
        await PlayHistory.update({playCount: playCount.dataValues.playCount+1}, {
            where: {userId: req.user.id, songId: songId}
            });
    } else {
        await PlayHistory.create({userId: req.user.id, songId: songId, playCount: 1});
    }
    res.json({ success: 'Added song into play history' });
});