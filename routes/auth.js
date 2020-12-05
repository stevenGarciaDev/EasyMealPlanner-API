const { User } = require("../models/user");
const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require("express");
const router = express.Router();

// login user
router.post("/", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.send(401).send('User does not exist');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);
  } catch (ex) {
    console.log("exception", ex);
    res.sendStatus(400, "unable to complete");
  }
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(100).required(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(req, schema);
}

module.exports = router;
