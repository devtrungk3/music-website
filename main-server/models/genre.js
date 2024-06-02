const { DataTypes } = require('sequelize');
const sequelize = require('../services/db');

const Genre = sequelize.define('Genre', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false
});

module.exports = Genre;