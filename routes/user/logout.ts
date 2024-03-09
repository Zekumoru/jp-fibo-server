import express from 'express';
import jwtAuth from '../../middlewares/jwtAuth';

const logoutRouter = express.Router();

logoutRouter.post('/', jwtAuth, (req, res) => {
  if (!req.user?.username) {
    return res.json({
      status: 403,
      message: 'User is already logged out.',
      user: null,
    });
  }

  res.cookie('accessToken', '', { httpOnly: true });
  res.json({
    status: 200,
    message: 'User logged out successfully',
    user: null,
  });
});

export default logoutRouter;
