import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction
} from 'react';
import Memo from './Memo';
import CreateMemo from './CreateMemo';
import { Grid } from '@nextui-org/react';
import IMemo from '../../interfaces/Memo';
import { AppContext } from '../../App';

interface IMemosContext {
  demoMemos: IMemo[];
  setDemoMemos: Dispatch<SetStateAction<IMemo[]>>;
}

const initialMemosContextData = {
  demoMemos: [],
  setDemoMemos: () => null
};

export const MemosContext = createContext<IMemosContext>(
  initialMemosContextData
);

const Memos = () => {
  const { loggedInUser, memos } = useContext(AppContext);
  const [demoMemos, setDemoMemos] = useState<IMemo[]>([
    {
      title: 'welcome...',
      content: '-> to Memoify!',
      dateCreated: Date.now(),
      author: { username: 'Memoify', name: 'Memoify', id: '' },
      id: 'id' + Date.now() + Math.floor(Math.random() * 9999)
    },
    {
      title: 'the minimalist notes web app...',
      content: '-> built for your basic daily needs!',
      dateCreated: Date.now(),
      author: { username: 'Memoify', name: 'Memoify', id: '' },
      id: 'id' + Date.now() + Math.floor(Math.random() * 9999)
    }
  ]);
  const reverseMemos: IMemo[] = JSON.parse(JSON.stringify(memos)).toReversed();
  const reverseDemoMemos: IMemo[] = JSON.parse(
    JSON.stringify(demoMemos)
  ).toReversed();

  return (
    <MemosContext.Provider value={{ demoMemos, setDemoMemos }}>
      <Grid.Container gap={1}>
        <Grid xs={3}>
          <CreateMemo />
        </Grid>
        {loggedInUser.token
          ? reverseMemos.map(memo => {
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
            })
          : reverseDemoMemos.map(memo => {
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
    </MemosContext.Provider>
  );
};

export default Memos;
