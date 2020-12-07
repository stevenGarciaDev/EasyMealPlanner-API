const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { Recipe } = require('../models/recipe');
const tokenAuth = require('../middleware/tokenAuth');
const adminTokenAuth = require('../middleware/adminTokenAuth');
const asyncMiddleware = require('../middleware/async');

/**
 * Get most recent 20 recipes.
 */
router.get('/', tokenAuth, asyncMiddleware(async (req, res) => {
    // query for Recipes 
    const recipes = await Recipe
        .find();
    // filter for user's ingredients to avoid 
    // return result
}));

/**
 * Get all recipes within the specified category.
 */
router.get('/:category', tokenAuth, asyncMiddleware(async (req, res) => {

}));

/**
 * Get all of user's saved recipes.
 */
router.get('/savedRecipes', tokenAuth, asyncMiddleware(async (req, res) => {

}));

/**
 * Get a specific recipe with the unique recipe ID.
 */
router.get('/:recipeId', tokenAuth, asyncMiddleware(async (req, res) => {

}));

/**
 * Create a new recipe.
 */
router.post('/', tokenAuth, adminTokenAuth, asyncMiddleware(async (req, res) => {
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

    res.send(result);
}));

/**
 * Update the status for a user saving a specific recipe.
 */
router.put('toggleSave/:recipeId', tokenAuth, asyncMiddleware(async (req, res) => {
    
}));

/**
 * Delete a specific recipe.
 */
router.delete('/:recipeId', tokenAuth, adminTokenAuth, asyncMiddleware(async (req, res) => {

}));

module.exports = router;