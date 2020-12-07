const express = require('express');
const cors = require('cors');
const auth = require('../routes/auth');
const users = require('../routes/users');
const recipes = require('../routes/recipes');
const errorHandler = require('../middleware/error');

module.exports = function(app) {
    app.use(cors());
    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/recipes', recipes);
    app.use(errorHandler);
}