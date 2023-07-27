import {
  useState,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction
} from 'react';
import Memos from './components/Memos';
import Sidebar from './components/Sidebar';
import IMemo from './interfaces/Memo';
import { getMemosByAuthor } from './services/memos';
import { useSessionStorage } from 'usehooks-ts';
import demoMemosData from './data/demoMemos';
import { Spacer } from '@nextui-org/react';

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
      {/* {loggedInUser.token ? ( */}
      <div id='App' className='grid gap-8 grid-cols-8'>
        <div className='col-span-7 flex flex-col items-center'>
          <h1
            className='text-6xl font-semibold leading-snug'
            style={{
              background: 'linear-gradient(to right, #4E4FEB, #DB005B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            memoify
          </h1>
          <Spacer y={6} />
          <Memos />
        </div>
        <Sidebar />
      </div>
      {/* ) : (
        <div id='App' className='flex flex-col items-center'>
          <h1
            className='text-6xl font-semibold leading-snug'
            style={{
              background: 'linear-gradient(to right, #4E4FEB, #DB005B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            memoify
          </h1>
          <Spacer y={6} />
          <Memos />
        </div>
      )} */}
    </AppContext.Provider>
  );
};

export default App;
