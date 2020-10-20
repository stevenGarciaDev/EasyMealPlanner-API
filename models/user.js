const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true, 
        minLength: 2,
        maxLength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
        trim: true,
    },
    currentWeight: {
        type: Number,
        required: false
    },
    goalWeight: {
        type: Number,
        required: false
    },
    birthYear: {
        type: Date,
        required: false
    },
    height: {
        type: Number, 
        required: false
    }
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(100).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(1024).required(),
        currentWeight: Joi.number(),
        goalWeight: Joi.number(),
        birthYear: Joi.date(),
        height: Joi.number
    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;