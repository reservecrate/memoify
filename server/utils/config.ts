import 'dotenv/config';

export const PORT = process.env.PORT as unknown as number;
export const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? (process.env.TEST_MONGODB_URI as string)
    : (process.env.MONGODB_URI as string);
