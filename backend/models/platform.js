const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
require('dotenv').config();

const platformSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

platformSchema.plugin(encrypt, {
  encryptionKey: process.env.ENC_KEY,
  signingKey: process.env.SIG_KEY,
  encryptedFields: ['password'],
});

const Platform = mongoose.model('Platform', platformSchema);

module.exports = {
  platformSchema: platformSchema,
  platform: Platform,
};