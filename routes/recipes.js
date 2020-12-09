const express = require('express');
const router = express.Router();
const { Recipe } = require('../models/recipe');
const { User } = require('../models/user');
const { UserSavedRecipe } = require('../models/userSavedRecipe');
const { MealType } = require('../models/mealType');
const { RecipeMealType } = require('../models/recipeMealType');
const tokenAuth = require('../middleware/tokenAuth');
const adminTokenAuth = require('../middleware/adminTokenAuth');
const asyncMiddleware = require('../middleware/async');

/**
 * Get all recipes for the user that do not contain ingredients
 * that the user can not consume.
 */
router.get('/', tokenAuth, asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.user._id);
    const restrictions = user.dietRestrictions;

    const recipes = await Recipe.find();

    const filteredRecipes = recipes.filter(recipe => {
        const ingredients = recipe.ingredients;
        let isRestrictedRecipe = false;

        for (let i = 0; i < restrictions.length; i++) {
            const restriction = restrictions[i];
            const isFound = ingredients.find(ingr => ingr.name === restriction);
            if (isFound) {
                isRestrictedRecipe = true;
                break;
            }
        }
        
        return isRestrictedRecipe ? null : recipe;
    });
    
    res.send(filteredRecipes);
}));

/**
 * Get all recipes within the specified category.
 */
router.get('/recipeCategory/:category', tokenAuth, asyncMiddleware(async (req, res) => {
    const recipes = await RecipeMealType
        .find({ mealTypeID: req.params.category })
        .populate('recipeID')
        .select('recipeID');

    res.send(recipes);
}));

/**
 * Get all of user's saved recipes.
 */
router.get('/savedRecipes', tokenAuth, asyncMiddleware(async (req, res) => {
    const usersRecipes = await UserSavedRecipe
        .find({ userID: req.user._id })
        .populate('recipeID')
        .select('recipeID');

    res.send(usersRecipes);
}));

/**
 * Get a specific recipe with the unique recipe ID.
 */
router.get('/:recipeId', tokenAuth, asyncMiddleware(async (req, res) => {
    const recipe = await Recipe.findById(req.params.recipeId);

    res.send(recipe);
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
 * Create a user saved recipe.
 */
router.post('/saveRecipe/:recipeId', tokenAuth, asyncMiddleware(async (req, res) => {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe)
        throw new Error(`Recipe with ID: ${req.params.recipeId} not found`);

    const existingSavedRecipe = await UserSavedRecipe
        .find({ userID: req.user._id, recipeID: recipe._id });

    if (existingSavedRecipe.length > 0) 
        throw new Error(`User has already saved that recipe.`, existingSavedRecipe[0]);

    const userSavedRecipe = new UserSavedRecipe({
        userID: req.user._id,
        recipeID: recipe._id
    });
    const result = await userSavedRecipe.save();
    res.send(result);
}));

/**
 * Create a user category/meal type.
 */
router.post('/createCategory', tokenAuth, asyncMiddleware(async (req, res) => {
    const category = new MealType({
        mealType: req.body.mealType
    });

    const result = await category.save();

    res.send(result);
}));

router.post('/addToCategory/:categoryId/:recipeId', tokenAuth, asyncMiddleware(async (req, res) => {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe)
        throw new Error(`Recipe with ID: ${req.params.recipeId} not found`);
    
    const recipeMealType = await RecipeMealType({
        recipeID: req.params.recipeId,
        mealTypeID: req.params.categoryId
    });

    const result = await recipeMealType.save();

    res.send(result);
}));

/**
 * Delete a user saved recipe.
 */
router.delete('/removeSavedRecipe/:recipeId', tokenAuth, asyncMiddleware(async (req, res) => {
    const result = await UserSavedRecipe.deleteOne({
         userID: req.user._id,
         recipeID: req.params.recipeId
    });

    res.send(result);
}));

/**
 * Delete a specific recipe.
 */
router.delete('/:recipeId', tokenAuth, adminTokenAuth, asyncMiddleware(async (req, res) => {
    const result = await Recipe.deleteOne({ _id: req.params.recipeId });

    await UserSavedRecipe.deleteMany({ recipeID: req.params.recipeId });

    res.send(result);
}));

module.exports = router;
