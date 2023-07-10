import {
  useState,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction
} from 'react';
import Memos from './components/Memos';
import Sidebar from './components/Sidebar';
import { Grid, Text, Row } from '@nextui-org/react';
import IMemo from './interfaces/Memo';
import { getMemosByAuthor } from './services/memos';
import { useSessionStorage } from 'usehooks-ts';
import demoMemosData from './data/demoMemos';

type user = {
  username: string;
  name: string;
  id: string;
  token: string;
};

interface IAppContext {
  memos: IMemo[];
  setMemos: Dispatch<SetStateAction<IMemo[]>>;
  loggedInUser: user;
  setLoggedInUser: Dispatch<SetStateAction<user>>;
  demoMemos: IMemo[];
  setDemoMemos: Dispatch<SetStateAction<IMemo[]>>;
}

const initialAppContextData: IAppContext = {
  memos: [],
  setMemos: () => null,
  loggedInUser: {
    username: '',
    name: '',
    id: '',
    token: ''
  },
  setLoggedInUser: () => null,
  demoMemos: [],
  setDemoMemos: () => null
};

export const AppContext = createContext<IAppContext>(initialAppContextData);

const App = () => {
  const [memos, setMemos] = useState<IMemo[]>([]);
  const [demoMemos, setDemoMemos] = useState<IMemo[]>(demoMemosData);
  const [loggedInUser, setLoggedInUser] = useSessionStorage(
    'loggedInUser',
    initialAppContextData.loggedInUser
  );

  const hook = () => {
    (async () => {
      if (loggedInUser.token) {
        try {
          const memosData = await getMemosByAuthor(loggedInUser.username);
          setMemos(memosData);
        } catch (err) {
          console.error(err);
        }
      } else {
        setMemos(demoMemos);
      }
    })();
  };

  useEffect(hook, [loggedInUser.token, loggedInUser.username, demoMemos]);

  return (
    <AppContext.Provider
      value={{
        memos,
        setMemos,
        loggedInUser,
        setLoggedInUser,
        demoMemos,
        setDemoMemos
      }}
    >
      <Grid.Container id='App'>
        <Grid xs={10} direction='column'>
          <Row justify='center'>
            <Text
              h1
              color='gradient'
              css={{
                textGradient: '45deg, $blue600 -20%, $pink600 50%'
              }}
            >
              memoify
            </Text>
          </Row>
          <Memos />
        </Grid>
        <Grid xs={2} direction='column'>
          <Sidebar />
        </Grid>
      </Grid.Container>
    </AppContext.Provider>
  );
};

export default App;
