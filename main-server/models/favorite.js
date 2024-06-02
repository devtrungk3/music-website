const sequelize = require('../services/db');
const { DataTypes } = require('sequelize');

const User = require('./user');
const Song = require('./song');
const Favorite = sequelize.define('Favorite', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    songId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
}, {
    timestamps: true
});

// define associations
User.hasMany(Favorite);
Favorite.belongsTo(User);
Song.hasMany(Favorite);
Favorite.belongsTo(Song);

module.exports = {
    User,
    Song,
    Favorite
}