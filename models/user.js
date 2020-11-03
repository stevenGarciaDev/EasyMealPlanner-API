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
    unitForMass: {
        type: String, 
        required: false,
        default: ''
    },
    goalBodyType: {
        type: String,
        required: false,
        default: 'Lean'
    },
    birthYear: {
        type: Date,
        required: false,
        default: new Date().getFullYear()
    },
    heightInFeet: {
        type: Number, 
        required: false,
        default: 0
    },
    heightInRemainingInches: {
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
    },
    confirmAccount: {
        type: Boolean,
        required: true,
        default: false, 
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
        gender: this.gender,
        goalBodyType: this.goalBodyType,
        unitForMass: this.unitForMass,
        heightInFeet: this.heightInFeet, 
        heightInRemainingInches: this.heightInRemainingInches,
        confirmAccount: this.confirmAccount
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
        height: Joi.number,
        goalBodyType: Joi.string(),
        unitForMass: Joi.string(),
        heightInFeet: Joi.number(),
        heightInRemainingInches: Joi.number(),
        confirmAccount: Joi.boolean()
    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;