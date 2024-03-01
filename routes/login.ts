import express, { Response } from 'express';
import { body } from 'express-validator';
import User from '../models/User';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwtAuth from '../middlewares/jwtAuth';

const loginRouter = express.Router();

const validations = [
  body('username').trim().toLowerCase().escape(),
  body('password').escape(),
];

const sendInvalidCredentials = (res: Response) => {
  res.status(403).json({
    status: 403,
    message: 'Invalid username and/or password',
  });
};

loginRouter.post(
  '/',
  jwtAuth,
  (req, res, next) => {
    if (req.user?.username) {
      res.json({
        status: 200,
        message: 'User is already logged in!',
      });
      return;
    }
    next();
  },
  ...validations,
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return sendInvalidCredentials(res);

    // validate password
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) return sendInvalidCredentials(res);

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_ACCESS_SECRET ?? 'jwt-access-secret',
      { expiresIn: '2d' }
    );

    res.cookie('accessToken', token, { httpOnly: true });
    res.json({
      status: 200,
      message: 'User logged in successfully!',
      token,
    });
  })
);

export default loginRouter;
