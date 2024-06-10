const mongoose = require('mongoose');

const platformModule = require('./platform.js');

const PlatformSchema = platformModule.platformSchema;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  platforms: [PlatformSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;