const asyncHandler = require('express-async-handler');

const User = require('../models/user');
const Song = require('../models/song');
const Artist = require('../models/artist');
const Genre = require('../models/genre');
const Playlist = require('../models/playlist');
const { PlayHistory } = require('../models/playHistory');
const sequelize = require('../services/db');


/**
 * data statistics 
 */
exports.statistics = asyncHandler(async (req, res) => {
    const users = await User.count({
        where: { role: 'USER'}
    });
    const admins = await User.count({
        where: { role: 'ADMIN'}
    })
    const songs = await Song.count();
    const artists = await Artist.count();
    const genres = await Genre.count();
    const playlists = await Playlist.count();
    const playHistory = await PlayHistory.sum('playCount');
    res.json({
        total_users: users,
        total_admins: admins,
        total_songs: songs,
        total_artists: artists,
        total_genres: genres,
        total_playlists: playlists,
        total_listens: playHistory,
    });
});

/**
 * get all users
 */
exports.getUsers = asyncHandler(async (req, res) => {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;

    const users = await User.findAll({
        attributes: ['id', 'username', 'fullname', 'email', 'createdAt'],
        where: { role: 'USER'},
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: (page-1)*limit
    });
    const count = await User.count({
        where: { role: 'USER'},   
    });
    res.json({
        users,
        page: page,
        page_size: limit,
        total_page: Math.ceil(count/limit)
    });
});

/**
 * user statistic by create time
 */
exports.userStatistics = asyncHandler(async (req, res) => {
    const year = parseInt(req.query.year) || 1;
    const data = await User.findAll({
        attributes: [
            [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'total_users']
        ],
        where: sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), year),
        group: [sequelize.fn('MONTH', sequelize.col('createdAt'))],
    });
    const months = [1,2,3,4,5,6,7,8,9,10,11,12];

    // mapping data to 12 months
    res.json(months.map(month => {
        const users = data.find(item => item.dataValues.month === month);
        return { month, total_users: users ? users.dataValues.total_users : 0 }
    }));
});