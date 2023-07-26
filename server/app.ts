import { MONGODB_URI } from './utils/config.ts';
import express from 'express';
import 'express-async-errors';
const app = express();
import cors from 'cors';
import loginRouter from './controllers/login.ts';
import usersRouter from './controllers/users/index.ts';
import memosRouter from './controllers/memos/index.ts';
import userMemosRouter from './controllers/userMemos.ts';
import morgan from 'morgan';
import { unknownEndpoint, errorHandler } from './utils/middleware.ts';
import { info } from './utils/logger.ts';
import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

(async () => {
  try {
    info(`connecting to: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    info('successfully connected to MongoDB');
  } catch (err: any) {
    info('error connecting to MongoDB:', err.message);
  }
})();

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/memos', memosRouter);
app.use('/', userMemosRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
