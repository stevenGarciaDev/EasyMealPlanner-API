const mongoose = require('mongoose');

const recipeMealTypeSchema = new mongoose.Schema({
    recipeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    },
    mealTypeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MealType'
    }
});

const RecipeMealType = mongoose.model('RecipeMealType', recipeMealTypeSchema);

module.exports.RecipeMealType = RecipeMealType;