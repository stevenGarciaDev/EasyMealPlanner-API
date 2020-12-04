const mongoose = require('mongoose');

const userSavedRecipeSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recipeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }
});

const UserSavedRecipe = mongoose.model('UserSavedRecipe', userSavedRecipeSchema);

module.exports.UserSavedRecipe = UserSavedRecipe;