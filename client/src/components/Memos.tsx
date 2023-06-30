import Memo from './Memo';
import { Grid } from '@nextui-org/react';
import MemoInterface from '../interfaces/Memo';

const Memos = ({ memos }: { memos: MemoInterface[] }) => {
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
