const express = require('express');
const router = exprsss.router();

/**
 * Retrive user's 5 day custom meal plan.
 */
router.get('/', (req, res) => {

});

/**
 * Generate user's 5 day custom meal plan.
 */
router.post('/generateMealPlan', (req, res) => {

});

/**
 * Update the completion status of a meal.
 */
router.put('/toggleCompletionStatus/:mealId', (req, res) => {

});

/**
 * Delete a user's custom meal plan.
 */
router.delete('/', (req, res) => {

});

module.exports = router;