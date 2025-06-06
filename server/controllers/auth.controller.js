import fs from 'fs';

import mongoose from 'mongoose';
import passport from 'passport';

import * as signInServices from '##/server/services/signin.services.js';

const User = mongoose.model('User');

const uploadDir = 'server/passport-files';

// Ensure passport folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

async function registerUser(req, res) {
  const { email, name, password } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: 'Please complete all the required fields.' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'Email already registered' });

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' + error.message });
  }
}

async function login(req, res, next) {
  try {
    await new Promise((resolve, reject) => {
      passport.authenticate('local', (error, user, info) => {
        if (!user || error) {
          reject(new Error('Error authenticating user' + error?.message));
        }

        req.login(user, (err) => {
          if (err) {
            return reject(new Error('Error logging in user' + info?.message));
          }
          resolve(user);
        });
      })(req, res, next);
    });
    return signInServices.sendSignInResponse(req, res);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

async function logout(req, res) {
  if (req.user) {
    req.user.lastLoggedInDate = null;
    await req.user.save();
  }

  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
}

function isAuthenticated(req, res) {
  return res.json({ isAuthed: req.isAuthenticated() });
}

export { login, logout, registerUser, isAuthenticated };
