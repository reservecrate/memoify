import { Schema, Document } from 'mongoose';

type PrettifiedUser = {
  username: string;
  name: string;
  passwordHash: string;
  memos: string[];
  id: string;
};

export default interface IUser extends PrettifiedUser {
  prettify: () => PrettifiedUser;
}

export type UserDoc = {
  username: string;
  name: string;
  passwordHash: string;
  memos: Schema.Types.ObjectId[];
  _id: Schema.Types.ObjectId;
  prettify: () => PrettifiedUser;
} & Document;
