const sequelize = require('../services/db');
const { DataTypes } = require('sequelize');

const Playlist = require('./playlist');
const Song = require('./song');
const PlaylistSong = sequelize.define('PlaylistSong', {
    playlistId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    songId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
}, {
    tableName: 'Playlists_songs',
    timestamps: true
});

// define associations
Playlist.hasMany(PlaylistSong);
PlaylistSong.belongsTo(Playlist);
Song.hasMany(PlaylistSong);
PlaylistSong.belongsTo(Song);

module.exports = {
    Playlist,
    Song,
    PlaylistSong
}