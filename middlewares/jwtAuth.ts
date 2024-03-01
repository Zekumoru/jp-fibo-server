import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import { JwtRequest } from '../types/express';

export type UserTokenObj = Pick<IUser, 'username'>;

const jwtAuth = (req: JwtRequest, res: Response, next: NextFunction) => {
  try {
    // get JWT from cookie
    const accessToken = req.cookies.accessToken;

    // go to next middleware if no access token (this is so if the next
    // middleware happens to be the handler for logging in)
    if (!accessToken) {
      return next();
    }

    // verify token
    const user = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET ?? 'jwt-access-secret'
    ) as UserTokenObj;
    req.user = { username: user.username };

    next();
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: 'Invalid access token',
    });
  }
};

export default jwtAuth;
