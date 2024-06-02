const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.db);

sequelize.authenticate().then(() => {
    console.log('Connection established successfully');
}).catch(err => {
    console.log('Unable to connect to database: ', err);
});

module.exports = sequelize;