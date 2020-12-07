const express = require('express');
const router = express.router();
const mongoose = require("mongoose");
const asyncMiddleware = require('../middleware/async');

/**
 * Get the ingredients in a user's grocery list.
 */
router.get('/', asyncMiddleware(async (req, res) => {

}));

/**
 * 
 */
router.put('/')