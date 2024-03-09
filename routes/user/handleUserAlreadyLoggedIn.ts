import { NextFunction, Request, Response } from 'express';

const handleUserAlreadyLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.username) {
    res.json({
      status: 200,
      message: 'User is already logged in!',
      user: req.user,
    });
    return;
  }
  next();
};

export default handleUserAlreadyLoggedIn;
