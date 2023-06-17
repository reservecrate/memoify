const memosRouter = require('express').Router();
const { getMemos, getMemo } = require('./getMemos');
const postMemo = require('./postMemo');
const putMemo = require('./putMemo');
const deleteMemo = require('./deleteMemo');

memosRouter.get('/', getMemos);

memosRouter.get('/:id', getMemo);

memosRouter.post('/', postMemo);

memosRouter.put('/:id', putMemo);

memosRouter.delete('/:id', deleteMemo);

module.exports = memosRouter;
