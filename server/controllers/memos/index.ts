import { Router } from 'express';
// import { getMemos, getMemo } from './getMemos.ts';
import createMemo from './createMemo.ts';
import updateMemo from './updateMemo.ts';
import deleteMemo from './deleteMemo.ts';

const memosRouter = Router();

// memosRouter.get('/', getMemos);

// memosRouter.get('/:id', getMemo);

memosRouter.post('/', createMemo);

memosRouter.put('/:id', updateMemo);

memosRouter.delete('/:id', deleteMemo);

export default memosRouter;
