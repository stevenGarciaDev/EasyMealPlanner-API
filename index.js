const auth = require('./routes/auth');
const users = require('./routes/users');
const recipes = require('./routes/recipes');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');
const errorHandler = require('./middleware/error');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

// When deploy. Use a connection string for production environment.
const db = config.get('db');
mongoose.connect(db)
    .then(() => console.log('Successfully connected to MongoDB...'))
    .catch(() => console.log('Unable to connect to MongoDB.'));

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/recipes', recipes);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log('Listening on port 5000');
});

module.exports = server;
