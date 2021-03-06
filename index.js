const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/db')();
require('./startup/routes')(app);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    winston.info('Listening on port 5000');
});

module.exports = server;
