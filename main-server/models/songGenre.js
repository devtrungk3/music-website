const sequelize = require('../services/db');

const Song = require('./song.js');
const Genre = require('./genre.js');
const SongGenre = sequelize.define('SongGenre', {}, { timestamps: false, tableName: 'songs_genres' });

// Define associations 
Song.belongsToMany(Genre, { through: SongGenre });
Genre.belongsToMany(Song, { through: SongGenre });

module.exports = {
  Song,
  Genre,
};