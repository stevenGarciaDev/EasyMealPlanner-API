const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');

router.get('/', (req, res) => {

});

router.post('/', async (req, res) => {
    const requestValidation = validate(req.body);
    console.log("requestValidation", requestValidation);
    if ("error" in requestValidation) {
        res.status(400).send(requestValidation.error);
        return;
    }

    const {
        firstName,
        email,
        password 
    } = req.body;

    const user = new User({
        firstName,
        email,
        password
    });

    const savedUser = await user.save();
    res.send(savedUser);
});

module.exports = router;