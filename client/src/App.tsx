import { createContext, Dispatch, SetStateAction } from 'react';
import Memos from './components/Memos';
import Sidebar from './components/Sidebar';
import Logout from './components/Logout';
import { useSessionStorage } from 'usehooks-ts';
import { Spacer } from '@nextui-org/react';
import { MdBook } from 'react-icons/md';

type user = {
  username: string;
  name: string;
  id: string;
  token: string;
};

interface IAppContext {
  loggedInUser: user;
  setLoggedInUser: Dispatch<SetStateAction<user>>;
}

const initialAppContextData: IAppContext = {
  loggedInUser: {
    username: '',
    name: '',
    id: '',
    token: ''
  },
  setLoggedInUser: () => null
};

export const AppContext = createContext<IAppContext>(initialAppContextData);

const App = () => {
  const [loggedInUser, setLoggedInUser] = useSessionStorage(
    'loggedInUser',
    initialAppContextData.loggedInUser
  );

  return (
    <AppContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser
      }}
    >
      {!loggedInUser.token ? (
        <div id='App' className='grid gap-8 grid-cols-8'>
          <div className='col-span-7 flex flex-col items-center h-screen'>
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
      ) : (
        <div id='App' className='flex flex-col items-center px-4 h-screen'>
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
          <Spacer y={3} />
          <div className='w-full flex flex-row justify-center'>
            <Logout />
          </div>
          <Spacer y={6} />
          <Memos />
        </div>
      )}
    </AppContext.Provider>
  );
};

export default App;
