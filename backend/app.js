const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/user.js');
const platformModule = require('./models/platform.js');
const authenticateToken = require('./middleware/authMiddleware.js');
require('./db/conn.js');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Platform = platformModule.platform;

const saltingRounds = 10;

// * -------- Register API --------
app.post('/register', async (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  const existingUser = await User.findOne({ email: userEmail });

  if (existingUser) {
    return res.send(
      JSON.stringify({ message: 'user with this email already exists' })
    );
  }

  bcrypt.genSalt(saltingRounds, (_, salt) => {
    bcrypt.hash(userPassword, salt, async (_, hashedPassword) => {
      const newUser = new User({
        email: userEmail,
        password: hashedPassword,
        platforms: [],
      });

      await newUser
        .save()
        .then(() =>
          res.send(
            JSON.stringify({
              message: 'user registered successfully',
              status: 200,
            })
          )
        )
        .catch((error) => {
          console.log(error);
          res.send(JSON.stringify({ message: 'user registration failed' }));
        });
    });
  });
});

// * -------- Login API --------
app.post('/login', async (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  const existingUser = await User.findOne({ email: userEmail });

  if (!existingUser) {
    return res.send(
      JSON.stringify({
        message: 'user with this email does not exist',
      })
    );
  }

  const isValidPassword = await bcrypt.compare(
    userPassword,
    existingUser.password
  );

  if (existingUser.email === userEmail && isValidPassword) {
    // * User authenticated, generate JWT token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    return res.send(
      JSON.stringify({
        status: 200,
        message: 'user logged in successfully',
        token: token,
      })
    );
  } else {
    return res.send(JSON.stringify({ message: 'invalid email or password' }));
  }
});

// * -------- Platform API's --------
app
  .route('/platform/:platformName')
  .get(authenticateToken, async (req, res) => {
    const userEmail = req.query.userEmail;
    const platformName = req.params.platformName;

    const foundUser = await User.findOne({ email: userEmail });

    if (foundUser) {
      const foundPlatform = foundUser.platforms.find(
        (platform) => platform.name === platformName
      );

      if (!foundPlatform) return res.json({ message: 'no credentials saved yet' });

      res.send(foundPlatform);
    } else {
      res.send(JSON.stringify({ message: 'user not found' }));
    }
  })
  .post(authenticateToken, async (req, res) => {
    const userEmail = req.query.userEmail;
    const platformName = req.params.platformName.toLowerCase().trim();
    const platformEmail = req.body.email;
    const platformPassword = req.body.password;

    const foundUser = await User.findOne({ email: userEmail });

    if (!foundUser)
      return res.send(JSON.stringify({ message: 'User not found' }));

    const existingPlatform = foundUser.platforms.find(
      (platform) => platform.name === platformName
    );

    if (!existingPlatform) {
      const newPlatform = new Platform({
        name: platformName,
        email: platformEmail,
        password: platformPassword,
      });
      foundUser.platforms.push(newPlatform);

      await foundUser
        .save()
        .then(() =>
          res.send(
            JSON.stringify({
              message: platformName + ' credentials saved successfully',
            })
          )
        )
        .catch((_) =>
          res.send(
            JSON.stringify({
              message: 'failed to save ' + platformName + ' credentials',
            })
          )
        );
    } else {
      res.send(
        JSON.stringify({
          message: platformName + ' credentials has already been saved',
        })
      );
    }
  })
  .patch(authenticateToken, async (req, res) => {
    const userEmail = req.query.userEmail;
    const platformName = req.params.platformName.toLowerCase().trim();
    const platformEmail = req.body.email;
    const platformPassword = req.body.password;

    const foundUser = await User.findOne({ email: userEmail });

    if (!foundUser)
      return res.send(JSON.stringify({ message: 'user not found!' }));

    // * Prepare the fields to be updated
    const updateFields = {};
    if (platformEmail) updateFields['platforms.$.email'] = platformEmail;
    if (platformPassword)
      updateFields['platforms.$.password'] = platformPassword;

    await User.updateOne(
      { email: userEmail, 'platforms.name': platformName },
      { $set: updateFields }
    )
      .then(() =>
        res.send(
          JSON.stringify({
            message: platformName + ' credentials updated successfully',
          })
        )
      )
      .catch((_) =>
        res.send(JSON.stringify({ message: 'failed to update credentials' }))
      );
  });

app.listen('3000', () => {
  console.log('Server is running on port 3000');
});