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
      setMemos(memosData);
    })();
  };

  useEffect(hook, []);

  return (
    <Grid.Container gap={1}>
      {memos.map(memo => {
        const { title, content, dateCreated, user, id } = memo;
        return (
          <Grid xs={3} key={id}>
            <Memo
              title={title}
              content={content}
              dateCreated={dateCreated}
              user={user}
              id={id}
            />
          </Grid>
        );
      })}
    </Grid.Container>
  );
};

export default Memos;
