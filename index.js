const auth = require('./routes/auth');
const users = require('./routes/users');
const recipes = require('./routes/recipes');
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

// When deploy. Use a connection string for production environment.
mongoose.connect('mongodb://localhost/easymealplanner')
    .then(() => console.log('Successfully connected to MongoDB...'))
    .catch(() => console.log('Unable to connect to MongoDB.'));



app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/recipes', recipes);


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Listening on port 5000');
});
