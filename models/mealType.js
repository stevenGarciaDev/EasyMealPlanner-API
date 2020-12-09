const mongoose = require('mongoose');

const mealTypeSchema = new mongoose.Schema({
    mealType: {
        type: String,
        required: true,
        unique: true,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Smoothie']
    }
});

const MealType = mongoose.model('MealType', mealTypeSchema);

module.exports.MealType = MealType;