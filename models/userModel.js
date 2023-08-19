const mongoose = require('mongoose');
const validator = require('validator');
const bCrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please enter password']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please enter confirm password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Confirm password did not match'
    }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bCrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
