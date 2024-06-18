const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/user.js');
const platformModule = require('./models/platform.js');
const authenticateToken = require('./middleware/authMiddleware.js');
const sendEmail = require('./controller/send-email.js');
require('./db/conn.js');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Platform = platformModule.platform;

const saltingRounds = 10;

// * -------- Register API --------
app.post('/register', async (req, res) => {
  const userEmail = req.body.email.toLowerCase().trim();
  const userPassword = req.body.password.trim();

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!userEmail.match(emailRegex)) {
    return res.send(JSON.stringify({ message: 'invalid email address' }));
  }

  if (userPassword.length < 8) {
    return res.send(
      JSON.stringify({ message: 'password should be at least 8 characters' })
    );
  }

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
          // console.log(error);
          res.send(JSON.stringify({ message: 'user registration failed' }));
        });
    });
  });
});

// * -------- Login API --------
app.post('/login', async (req, res) => {
  const userEmail = req.body.email.toLowerCase().trim();
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

// * Generate random 6 digit code
function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// * -------- Forget Password API --------
app.post('/forgot-password', async (req, res) => {
  const userEmail = req.body.email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: userEmail });

  if (!existingUser) {
    return res.send(JSON.stringify({ message: 'email is not registered' }));
  }

  const resetCode = generateResetCode();

  const info = await sendEmail({
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: 'Reset Password',
    text: `Your password reset code is ${resetCode}. This code will expire in 1 hour.`,
  });

  if (info.accepted) {
    existingUser.resetPasswordCode = resetCode;
    existingUser.resetCodeExpireTime = Date.now() + 3600000;

    await existingUser.save();

    return res.send(
      JSON.stringify({
        message: 'email sent successfully to recipient',
        expireTime: existingUser.resetCodeExpireTime,
      })
    );
  } else {
    return res.send(
      JSON.stringify({
        message: 'unexpected error occurred while sending an email',
      })
    );
  }
});

// * -------- Reset Password API --------
app
  .route('/reset-password')
  .post(async (req, res) => {
    const userEmail = req.body.email;
    const resetCode = req.body.resetCode;

    const validUser = await User.findOne({
      email: userEmail,
      resetPasswordCode: resetCode,
      resetCodeExpireTime: { $gt: Date.now() }, // $gt means greater than
    });

    if (validUser) {
      return res.send(JSON.stringify({ message: 'valid reset code' }));
    } else {
      return res.send(
        JSON.stringify({ message: 'invalid or expired reset code' })
      );
    }
  })
  .patch(async (req, res) => {
    const userEmail = req.body.email.toLowerCase().trim();
    const userNewPassword = req.body.newPassword;

    const existingUser = await User.findOne({ email: userEmail });

    bcrypt.genSalt(saltingRounds, (_, salt) => {
      bcrypt.hash(userNewPassword, salt, async (_, hashedPassword) => {
        existingUser.password = hashedPassword;
        existingUser.resetPasswordCode = undefined;
        existingUser.resetCodeExpireTime = undefined;

        await existingUser
          .save()
          .then(() =>
            res.send(
              JSON.stringify({
                message: 'password reset successfully',
              })
            )
          )
          .catch((_) => {
            res.send(JSON.stringify({ message: 'password reset failed' }));
          });
      });
    });
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

      if (!foundPlatform)
        return res.json({ message: 'no credentials saved yet' });

      res.send(foundPlatform);
    } else {
      res.send(JSON.stringify({ message: 'user not found' }));
    }
  })
  .post(authenticateToken, async (req, res) => {
    const userEmail = req.query.userEmail;
    const platformName = req.params.platformName.toLowerCase().trim();
    const platformEmail = req.body.email.toLowerCase().trim();
    const platformPassword = req.body.password.trim();

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
    const platformEmail = req.body.email.toLowerCase().trim();
    const platformPassword = req.body.password.trim();

    const foundUser = await User.findOne({ email: userEmail });

    if (!foundUser)
      return res.send(JSON.stringify({ message: 'user not found!' }));

    const existingPlatform = foundUser.platforms.find(
      (platform) => platform.name === platformName
    );

    if (platformEmail) existingPlatform.email = platformEmail;

    if (platformPassword) existingPlatform.password = platformPassword;

    await foundUser
      .save()
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

    // ! Update query does'not work in mongoose-encryption
    // // * Prepare the fields to be updated
    // const updateFields = {};
    // if (platformEmail) {
    //   console.log(platformEmail);
    //   updateFields['platforms.$.email'] = platformEmail;
    // }
    // if (platformPassword) {
    //   console.log(platformPassword);
    //   updateFields['platforms.$.password'] = platformPassword;
    // }

    // await User.updateOne(
    //   { email: userEmail, 'platforms.name': platformName },
    //   { $set: updateFields }
    // )
  });

app.listen('3000', () => {
  console.log('Server is running on port 3000');
});
