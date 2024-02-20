import express from 'express';

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'All is well.',
  });
});

export default indexRouter;
