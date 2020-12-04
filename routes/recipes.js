const express = require('express');
const router = express.Router();
const { Recipe } = require('../models/recipe');
const tokenAuth = require('../middleware/tokenAuth');

/**
 * Get all recipes.
 */
router.get('/', (req, res) => {
    res.send('Hello World');
});

/**
 * Get all recipes within the specified category.
 */
router.get('/:category', (req, res) => {

});

/**
 * Get all of user's saved recipes.
 */
router.get('/savedRecipes', (req, res) => {

});

/**
 * Get a specific recipe with the unique recipe ID.
 */
router.get('/:recipeId', (req, res) => {

});

/**
 * Create a new recipe.
 */
router.post('/', tokenAuth, async (req, res) => {
    try {
        const {
            name,
            servings,
            minutesToCook,
            calories,
            protein,
            carbohydrates,
            fats,
            image,
            description,
            ingredients
        } = req.body;

        const recipe = new Recipe({
            name,
            servings,
            minutesToCook,
            calories,
            protein,
            carbohydrates,
            fats,
            image,
            description,
            ingredients
        });
        const result = await recipe.save();
        console.log("result", result);

        res.send(result);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});

/**
 * Update the status for a user saving a specific recipe.
 */
router.put('toggleSave/:recipeId/', (req, res) => {

});

/**
 * Delete a specific recipe.
 */
router.delete('/:recipeId', (req, res) => {

});

module.exports = router;