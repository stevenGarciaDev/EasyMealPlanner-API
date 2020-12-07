const express = require('express');
const router = exprsss.router();
const mongoose = require("mongoose");
const asyncMiddleware = require('../middleware/async');

/**
 * Retrive user's 5 day custom meal plan.
 */
router.get('/', asyncMiddleware(async (req, res) => {

}));

/**
 * Generate user's 5 day custom meal plan.
 */
router.post('/generateMealPlan', asyncMiddleware(async (req, res) => {

}));

/**
 * Update the completion status of a meal.
 */
router.put('/toggleCompletionStatus/:mealId', asyncMiddleware(async (req, res) => {

}));

/**
 * Delete a user's custom meal plan.
 */
router.delete('/', asyncMiddleware(async (req, res) => {

}));

module.exports = router;