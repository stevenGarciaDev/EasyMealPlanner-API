const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');

// Register a new user
router.post("/", async (req, res) => {
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
        firstName: user.firstName,
        email: user.email,
        _id: user._id,
      });
});

module.exports = router;