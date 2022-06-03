const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/', async (request, response) => {
  const users = await User.find({});

  response.json(users);
});

userRouter.post('/', async (request, response) => {
  const {
    username, password,
  } = request.body;

  if (username.length < 3) {
    return response.status(400).json({
      error: 'username must be at least 3 characters long',
    });
  } if (password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long',
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique',
    });
  }

  const saltrounds = 10;
  const passwordHash = await bcrypt.hash(password, saltrounds);

  const user = new User({
    username,
    passwordHash,
    location: [],
  });

  console.log(passwordHash);

  const newUser = await user.save();
  response.status(201).send(newUser).end();
});

module.exports = userRouter;
