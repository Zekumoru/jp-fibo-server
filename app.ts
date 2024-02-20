import express from 'express';
import indexRouter from './routes/index';
import userRouter from './routes/user';
import errorHandler from './middlewares/errorHandler';
import createError from 'http-errors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set routers
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use((req, res, next) => next(createError(500)));
app.use(errorHandler);

export default app;
