const sequelize = require('../services/db');

const Song = require('./song.js');
const Artist = require('./artist.js');
const SongArtist = sequelize.define('SongArtist', {}, { timestamps: false, tableName: 'songs_artists' });

// Define associations 
Song.belongsToMany(Artist, { through: SongArtist });
Artist.belongsToMany(Song, { through: SongArtist });

module.exports = {
  Song,
  Artist,
};