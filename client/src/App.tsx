import {
  useState,
  useEffect,
  useMemo,
  createContext,
  Dispatch,
  SetStateAction
} from 'react';
import Memos from './components/Memos';
import Sidebar from './components/Sidebar';
import { Grid, Text, Row } from '@nextui-org/react';
import IMemo from './interfaces/Memo';
import { getMemos } from './services/memos';
import { useSessionStorage } from 'usehooks-ts';

type user = {
  username: string;
  name: string;
  id: string;
  token: string;
};

interface IAppContext {
  memos: IMemo[];
  setMemos: Dispatch<SetStateAction<IMemo[]>>;
  memoifiedUser: user;
  setLoggedInUser: Dispatch<SetStateAction<user>>;
}

const initialAppContextData: IAppContext = {
  memos: [],
  setMemos: () => null,
  memoifiedUser: {
    username: '',
    name: '',
    id: '',
    token: ''
  },
  setLoggedInUser: () => null
};

export const AppContext = createContext<IAppContext>(initialAppContextData);

const App = () => {
  //implement client side form checking for faster rendering
  const [memos, setMemos] = useState<IMemo[]>([]);
  const [loggedInUser, setLoggedInUser] = useSessionStorage(
    'loggedInUser',
    initialAppContextData.memoifiedUser
  );
  const memoifiedUser = useMemo(() => loggedInUser, [loggedInUser]);

  const hook = () => {
    (async () => {
      try {
        const memosData = await getMemos();
        setMemos(memosData);
      } catch (err) {
        console.error(err);
      }
    })();
  };

  useEffect(hook, []);

  return (
    <AppContext.Provider
      value={{
        memos,
        setMemos,
        setLoggedInUser,
        memoifiedUser
      }}
    >
      <Grid.Container id='App'>
        <Grid xs={10} direction='column'>
          <Row justify='center'>
            <Text h1>memoify</Text>
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
