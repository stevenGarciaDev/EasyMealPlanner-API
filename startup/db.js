const winston = require('winston');
const config = require('config');
const mongoose = require('mongoose');

module.exports = function() {
    // When deploy. Use a connection string for production environment.
    const db = config.get('db');
    mongoose.connect(db)
        .then(() => winston.info('Successfully connected to MongoDB...'))
}