const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    unitOfMeasurement: {
        type: String,
        required: true
    },
    aisle: {
        type: String,
        required: true,
        enum: ['Produce', 'Meat']
    }
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports.ingredientSchema = ingredientSchema;
module.exports.Ingredient = Ingredient;