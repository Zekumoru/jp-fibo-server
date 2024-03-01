import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      username: string;
    }
  }
}

export interface JwtRequest extends Request {
  cookies: {
    accessToken?: string;
  };
}
