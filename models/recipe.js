const mongoose = require('mongoose');
const { ingredientSchema } = require('./ingredient');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    servings: {
        type: Number, 
        required: true
    },
    minutesToCook: {
        type: Number, 
        required: true 
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true 
    },
    carbohydrates: {
        type: Number,
        required: true 
    },
    fats: {
        type: Number, 
        required: true 
    },
    image: {
        type: String, 
        required: true 
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    ingredients: {
        type: [ingredientSchema],
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        required: true
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports.Recipe = Recipe;