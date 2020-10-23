const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

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
        maxlength: 255,
        trim: true,
    },
    currentWeight: {
        type: Number,
        required: false,
        default: 0
    },
    goalWeight: {
        type: Number,
        required: false,
        default: 0
    },
    birthYear: {
        type: Date,
        required: false,
        default: new Date().getFullYear()
    },
    height: {
        type: Number, 
        required: false,
        default: 0
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    gender: {
        type: String,
        default: 'Female',
        required: false
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
      {
        _id: this._id,
        firstName: this.firstName,
        email: this.email,
        isAdmin: this.isAdmin,
        currentWeight: this.currentWeight,
        goalWeight: this.goalWeight,
        height: this.height,
        birthYear: this.birthYear,
        gender: this.gender
      },
      config.get('jwtPrivateKey')
    );
  
    return token;
}

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