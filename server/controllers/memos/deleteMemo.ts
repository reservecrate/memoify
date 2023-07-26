import Memo from '../../models/memo.ts';
import { Request, Response } from 'express';
import { UserDoc } from '../../interfaces/user.ts';
import { MemoDoc } from '../../interfaces/memo.ts';
import { userExtractor } from '../../utils/api_helper.ts';

const deleteMemo = async (req: Request, res: Response) => {
  const memoId = req.params.id;
  const memoToDelete = (await Memo.findById(memoId)) as MemoDoc;

  const author = (await userExtractor(req, res)) as unknown as UserDoc;

  if (!author) return res.status(401).json({ error: 'invalid/missing token' });
  else if (memoToDelete.author.toString() !== author.id)
    return res.status(401).json({
      error: 'wrong token (not authorised)'
    });
  const deletedMemo = (await Memo.findByIdAndDelete(memoId)) as MemoDoc;
  const prettifiedDeletedMemo = await deletedMemo.prettify();
  res.status(200).json(prettifiedDeletedMemo);
};

export default deleteMemo;
