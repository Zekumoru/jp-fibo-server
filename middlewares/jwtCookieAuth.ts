import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const jwtCookieAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({
        status: 401,
        message: 'Missing access token in authorization header',
      });
      return;
    }

    const user = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET ?? 'jwt-access-secret'
    );
    console.log(user);

    // req.user = {
    //   username: user.username;
    // };
    next();
  } catch (err) {
    res.status(403).json({
      status: 403,
      message: 'You need to be logged in first.',
    });
  }
};

export default jwtCookieAuth;
