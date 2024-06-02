const { DataTypes } = require('sequelize');
const sequelize = require('../services/db');

const Song = sequelize.define('Song', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    releasedYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    audio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    mode: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    bpm: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    popularity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    danceability: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    energy: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    loudness: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    speechiness: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    acousticness: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    liveness: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    valence: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    timestamps: false
});

module.exports = Song;