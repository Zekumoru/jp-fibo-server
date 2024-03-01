declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOSTNAME?: string;
      HOST?: string;
      PORT?: string;
      NODE_ENV?: 'development' | 'production';
      MONGODB_CONNECTION_STRING?: string;
      PASSWORD_SALT?: string;
      JWT_ACCESS_SECRET?: string;
    }
  }
}

export {};
