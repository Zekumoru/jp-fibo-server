import express from 'express';
import indexRouter from './routes/index';
import userRouter from './routes/user/user';
import errorHandler from './middlewares/errorHandler';
import createError from 'http-errors';
import jpCardRouter from './routes/jp-card';
import cors from 'cors';
import loginRouter from './routes/user/login';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: ['http://127.0.0.1:5713', 'http://localhost:5173'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// set routers
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/jp-card', jpCardRouter);
app.use((req, res, next) => next(createError(500)));
app.use(errorHandler);

export default app;
