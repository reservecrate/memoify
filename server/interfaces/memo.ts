import { Schema, Document } from 'mongoose';

export type PrettifiedMemo = {
  title: string;
  content: string;
  dateCreated: number;
  author: {
    username: string;
    name: string;
    id: string;
  };
  id: string;
};

export default interface IMemo extends PrettifiedMemo {
  prettify: () => Promise<PrettifiedMemo>;
}

export type MemoDoc = {
  title: string;
  content: string;
  dateCreated: number;
  author: Schema.Types.ObjectId;
  _id: Schema.Types.ObjectId;
  prettify: () => Promise<PrettifiedMemo>;
} & Document;

export type PopulatedMemoDoc = {
  title: string;
  content: string;
  dateCreated: number;
  author: {
    username: string;
    name: string;
    _id: string;
  };
  _id: Schema.Types.ObjectId;
} & Document;
