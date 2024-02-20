#!/usr/bin/env ts-node

/**
 * Module dependencies.
 */

import 'dotenv/config';
import app from '../app';
import debug from 'debug';
import http from 'http';
import mongoose from 'mongoose';

const serverDebug = debug('fibo-flashcards:server');

/**
 * Connect to mongodb
 */

const dbString = process.env.MONGODB_CONNECTION_STRING;

(async () => {
  if (!dbString) throw new Error('Mongodb connection string is undefined');

  await mongoose.connect(dbString);
  serverDebug(`Successfully connected to mongodb`);
})().catch((error: { message: string }) => {
  serverDebug(`Cannot connect to db: ${error.message}`);
});

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
const hostname = process.env.HOSTNAME ?? 'localhost';
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  serverDebug(`Server started running on http://${hostname}:${port}`);
});
server.on('error', onError);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
