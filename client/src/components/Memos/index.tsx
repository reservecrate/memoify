import { useContext } from 'react';
import Memo from './Memo';
import CreateMemo from './CreateMemo';
import { Grid } from '@nextui-org/react';
import IMemo from '../../interfaces/Memo';
import { AppContext } from '../../App';

const Memos = () => {
  const { memos, loggedInUser, demoMemos } = useContext(AppContext);
  const reverseMemos: IMemo[] = loggedInUser.token
    ? JSON.parse(JSON.stringify(memos)).toReversed()
    : JSON.parse(JSON.stringify(demoMemos)).toReversed();

  return (
    <Grid.Container gap={1.5}>
      <Grid xs={3}>
        <CreateMemo />
      </Grid>
      {reverseMemos.map(memo => {
        const { title, content, dateCreated, author, id } = memo;
        return (
          <Grid xs={3} key={id}>
            <Memo
              title={title}
              content={content}
              dateCreated={dateCreated}
              author={author}
              id={id}
            />
          </Grid>
        );
      })}
    </Grid.Container>
  );
};

export default Memos;
