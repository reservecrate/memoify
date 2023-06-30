import { useState, useEffect } from 'react';
import Memo from './Memo';
import { Grid } from '@nextui-org/react';
import MemoProps from '../interfaces/Memo';
import {
  getAllMemos
  // getMemo,
  // createMemo,
  // updateMemo,
  // deleteMemo
} from '../services/memos';

const Memos = () => {
  const [memos, setMemos] = useState<MemoProps[]>([]);

  const hook = () => {
    (async () => {
      const memosData = await getAllMemos();
      const clone: any = memosData[0];
      setMemos(memosData);
    })();
  };

  useEffect(hook, []);

  return (
    <Grid.Container gap={1}>
      {memos.map(memo => {
        const { title, content, dateCreated } = memo;
        return (
          <Grid xs={3}>
            <Memo title={title} content={content} dateCreated={dateCreated} />
          </Grid>
        );
      })}
    </Grid.Container>
  );
};

export default Memos;
