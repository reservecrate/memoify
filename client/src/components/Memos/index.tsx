import { useContext } from 'react';
import Memo from './Memo';
import CreateMemo from './CreateMemo';
import { Grid } from '@nextui-org/react';
import IMemo from '../../interfaces/Memo';
import { AppContext } from '../../App';

const Memos = () => {
  const { loggedInUser, memos } = useContext(AppContext);
  const demoMemos = [
    {
      title: 'welcome...',
      content: '-> to Memoify!',
      dateCreated: Date.now(),
      user: { username: 'Memoify', name: 'Memoify', id: '' },
      id: 'fakememo1'
    },
    {
      title: 'the minimalist notes web app...',
      content: '-> built for your basic daily needs!',
      dateCreated: Date.now(),
      user: { username: 'Memoify', name: 'Memoify', id: '' },
      id: 'fakememo2'
    }
  ];
  const reverseMemos: IMemo[] = JSON.parse(JSON.stringify(memos)).toReversed();

  return (
    <Grid.Container gap={1}>
      <Grid xs={3}>
        <CreateMemo />
      </Grid>
      {loggedInUser.token
        ? reverseMemos.map(memo => {
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
          })
        : demoMemos.map(memo => {
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
