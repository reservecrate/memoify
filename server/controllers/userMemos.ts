import { Request, Response } from 'express';
import { Router } from 'express';
import User from '../models/user.ts';
import Memo from '../models/memo.ts';
import { MemoDoc } from '../interfaces/memo.ts';

const userMemosRouter = Router();

const getMemosByAuthor = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (!user)
    return res.status(404).json({ error: 'invalid/nonexistent username' });

  const memos: MemoDoc[] = await Memo.find({});
  const prettifiedMemos = await Promise.all(
    memos.map(async memo => await memo.prettify())
  );
  const memosByAuthor = prettifiedMemos.filter(
    memo => memo.author.username === username
  );

  res.status(200).json(memosByAuthor);
};

userMemosRouter.get('/:username/memos', getMemosByAuthor);

export default userMemosRouter;
