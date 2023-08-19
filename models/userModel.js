const mongoose = require('mongoose');
const validator = require('validator');

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

const User = mongoose.model('User', userSchema);
module.exports = User;
