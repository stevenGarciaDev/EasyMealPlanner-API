const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.get('/:recipeId', (req, res) => {

});

router.post('/', (req, res) => {

});

router.delete('/:recipeId', (req, res) => {

});

module.exports = router;