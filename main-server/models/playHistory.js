const sequelize = require('../services/db');
const { DataTypes } = require('sequelize');

const User = require('./user');
const Song = require('./song');
const PlayHistory = sequelize.define('PlayHistory', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    songId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    playCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'play_history',
    timestamps: true,
});

// define associations
User.hasMany(PlayHistory);
PlayHistory.belongsTo(User);
Song.hasMany(PlayHistory);
PlayHistory.belongsTo(Song);

module.exports = {
    User,
    Song,
    PlayHistory
}