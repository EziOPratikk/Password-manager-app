const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to mongodb atlas successfully!'))
  .catch((error) => console.log(error));