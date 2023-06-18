const memosRouter = require('express').Router();
const { getMemos, getMemo } = require('./getMemos');
const createMemo = require('./createMemo');
const updateMemo = require('./updateMemo');
const deleteMemo = require('./deleteMemo');

memosRouter.get('/', getMemos);

memosRouter.get('/:id', getMemo);

memosRouter.post('/', createMemo);

memosRouter.put('/:id', updateMemo);

memosRouter.delete('/:id', deleteMemo);

module.exports = memosRouter;
