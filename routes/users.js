const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require("mongoose");
const tokenAuth = require('../middleware/tokenAuth');
const { User, validate } = require('../models/user');
const asyncMiddleware = require('../middleware/async');

// Register a new user
router.post("/", asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');
  
    user = new User( _.pick(req.body, ['firstName', 'email', 'password']) );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
  
    const token = user.generateAuthToken();
    res
      .header('x-auth-token', token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({
        token
      });
}));

router.put("/onboarding", tokenAuth, asyncMiddleware(async (req, res) => {
  const { 
    unitForMass,
    currentWeight,
    goalWeight,
    goalBodyType,
    activityLevel,
    gender,
    age,
    heightInFeet,
    heightInRemainingInches,
    dietRestrictions,
    confirmAccount
  } = req.body;

  const userId = req.user._id;
  const user = await User.findByIdAndUpdate(userId,
    {
      unitForMass,
      currentWeight,
      goalWeight,
      goalBodyType,
      activityLevel,
      gender,
      age,
      heightInFeet,
      heightInRemainingInches,
      dietRestrictions,
      confirmAccount,
      completedOnboarding: true
    }, { new: true });

  if (!user) return res.status(404).send("User not found");

  const token = user.generateAuthToken();
  res.send(token);
}));

/**
 * Get the ratio for the user's nutrition metrics.
 */
router.get('/dailyNutrtionMetrics', asyncMiddleware(async (req, res) => {

}));

module.exports = router;