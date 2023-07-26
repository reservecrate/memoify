import Memo from '../../models/memo.ts';
import { Request, Response } from 'express';
// import IRequest from '../../interfaces/req.ts';
import { UserDoc } from '../../interfaces/user.ts';
import { MemoDoc } from '../../interfaces/memo.ts';
import { userExtractor } from '../../utils/api_helper.ts';

const updateMemo = async (req: Request, res: Response) => {
  const memoId = req.params.id;
  const memoToUpdate = (await Memo.findById(memoId)) as MemoDoc;

  if (!memoToUpdate)
    return res.status(404).json({ error: 'invalid/nonexistent memo id' });

  const author = (await userExtractor(req, res)) as unknown as UserDoc;

  if (!author) return res.status(401).json({ error: 'invalid/missing token' });
  if (memoToUpdate.author.toString() !== author.id)
    return res.status(401).json({
      error: 'wrong/invalid token (not authorised)'
    });

  const updatedMemoPayload = req.body;
  const updatedMemo = (await Memo.findByIdAndUpdate(
    memoId,
    updatedMemoPayload,
    {
      new: true
    }
  )) as MemoDoc;
  const prettifiedUpdatedMemo = await updatedMemo.prettify();
  res.status(200).json(prettifiedUpdatedMemo);
};

export default updateMemo;
