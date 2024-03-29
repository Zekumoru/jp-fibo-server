import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User, { IUser } from '../../models/User';
import loginRouter from './login';
import logoutRouter from './logout';

const userRouter = express.Router();

const validations = [
  body('username')
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ max: 100 })
    .withMessage('Username must be 100 characters or below')
    .escape()
    .custom(async (username) => {
      const user = await User.findOne({ username });
      if (user) throw new Error('Username already taken');
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 30 })
    .withMessage('Password must be 8 to 30 characters long')
    .escape(),
];

userRouter.use('/login', loginRouter);
userRouter.use('/logout', logoutRouter);

const createUser = async ({ username, password }: IUser) => {
  let salt = Number(process.env.PASSWORD_SALT);
  if (isNaN(salt)) salt = 5;
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    username,
    password: hashedPassword,
  });

  await user.save();
};

userRouter.post(
  '/create',
  ...validations,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({
        status: 422,
        message: 'Registration fields have errors.',
        errors: errors.mapped(),
      });
      return;
    }

    await createUser(req.body);

    res.status(201).json({
      status: 201,
      message: 'User has registered successfully.',
    });
  })
);

userRouter.get(
  '/:username',
  asyncHandler(async (req, res) => {
    const username = req.params.username ?? '';
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({
        status: 404,
        message: `User '${username}' not found.`,
      });
      return;
    }

    res.json({
      status: 200,
      user: {
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  })
);

userRouter.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'User route',
  });
});

export default userRouter;
