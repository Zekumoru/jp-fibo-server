import express from 'express';

const app = express();

app.use('/', (req, res) => {
  res.send('Status Active!');
});

export default app;
