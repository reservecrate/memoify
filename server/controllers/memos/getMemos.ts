import { Request, Response } from 'express';
import Memo from '../../models/memo.ts';
import { MemoDoc } from '../../interfaces/memo.ts';

export const getMemos = async (req: Request, res: Response) => {
  const memos: MemoDoc[] = await Memo.find({});
  const prettifiedMemos = await Promise.all(
    memos.map(async memo => await memo.prettify())
  );
  res.status(200).json(prettifiedMemos);
};

export const getMemo = async (req: Request, res: Response) => {
  const memo = (await Memo.findById(req.params.id)) as MemoDoc;
  const prettifiedMemo = await memo.prettify();
  res.status(200).json(prettifiedMemo);
};
