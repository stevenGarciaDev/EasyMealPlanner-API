const { User } = require("../models/user");
const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require("express");
const router = express.Router();

// login user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.send(401).send('User does not exist');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res
    .header('x-auth-token', token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(100).required().email(),
    password: Joi.string().min(5).max(255).required()
  }

  return Joi.validate(req, schema);
}

module.exports = router;
