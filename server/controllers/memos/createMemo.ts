import { Request, Response } from 'express';
import Memo from '../../models/memo.ts';
import { UserDoc } from '../../interfaces/user.ts';
import { MemoDoc } from '../../interfaces/memo.ts';
import { userExtractor } from '../../utils/api_helper.ts';

const createMemo = async (req: Request, res: Response) => {
  !req.body.title ? (req.body.title = 'untitled memo') : null;
  !req.body.content ? (req.body.content = '') : null;
  !req.body.dateCreated ? (req.body.dateCreated = Date.now()) : null;

  const author = (await userExtractor(req, res)) as unknown as UserDoc;

  if (!author) return res.status(401).json({ error: 'invalid/missing token' });
  const memoToCreate = new Memo({
    ...req.body,
    author: author.id
  }) as unknown as MemoDoc;
  const createdMemo = await memoToCreate.save();
  author.memos = [...author.memos, createdMemo.id];
  await author.save();
  const prettifiedMemo = await createdMemo.prettify();
  res.status(201).json(prettifiedMemo);
};

export default createMemo;
