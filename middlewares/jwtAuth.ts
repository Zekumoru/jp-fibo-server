import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import { JwtRequest } from '../types/express';

export type UserTokenObj = Pick<IUser, 'username'>;

const jwtAuth = (req: JwtRequest, res: Response, next: NextFunction) => {
  try {
    // get JWT from cookie
    const accessToken = req.cookies.accessToken;

    // check that the user is logged-in in the client
    if (accessToken === undefined) {
      res.status(401).json({
        status: 401,
        message: 'You need to be logged in first',
      });
      return;
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
