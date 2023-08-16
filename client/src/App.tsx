import { useEffect, useState } from 'react';
import { createContext, Dispatch, SetStateAction } from 'react';
import Memos from './components/Memos';
import Sidebar from './components/Sidebar';
import Logout from './components/Logout';
import { useSessionStorage } from 'usehooks-ts';
import { Spacer } from '@nextui-org/react';
// import getRandomGradient from './utils/getRandomColour';
import { TfiGithub } from 'react-icons/tfi';
import { Button, Link } from '@nextui-org/react';

type user = {
  username: string;
  name: string;
  id: string;
  token: string;
};

interface IAppContext {
  loggedInUser: user;
  setLoggedInUser: Dispatch<SetStateAction<user>>;
  gradient: string;
}

const initialAppContextData: IAppContext = {
  loggedInUser: {
    username: '',
    name: '',
    id: '',
    token: ''
  },
  setLoggedInUser: () => null,
  gradient: ''
};

export const AppContext = createContext<IAppContext>(initialAppContextData);

const App = () => {
  const [loggedInUser, setLoggedInUser] = useSessionStorage(
    'loggedInUser',
    initialAppContextData.loggedInUser
  );
  const [gradient, setGradient] = useState(
    'linear-gradient(to right, #4E4FEB, #DB005B)'
  );
  // start
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const randomGradient = getRandomGradient();

  //   setGradient(randomGradient);
  //   setIsLoading(false);
  // }, []);

  // if (isLoading) return null;
  // end
  const [resetVariant, setResetVariant] = useState('bordered');
  const [githubVariant, setGithubVariant] = useState('bordered');

  return (
    <AppContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
        gradient
      }}
    >
      {!loggedInUser.token ? (
        <div id='App' className='flex flex-col'>
          <div className='flex flex-row justify-center items-center w-full'>
            <div className='w-10/12 flex flex-row justify-center'>
              <h1
                className='text-6xl font-bold leading-snug'
                style={{
                  // background: 'linear-gradient(to right, #4E4FEB, #DB005B)',
                  background: gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                memoify
              </h1>
            </div>
            <div className='flex flex-row justify-evenly w-2/12 items-center'>
              <Button
                variant={resetVariant}
                color='danger'
                size='lg'
                onMouseEnter={() => setResetVariant('flat')}
                onMouseLeave={() => setResetVariant('bordered')}
              >
                reset demo
              </Button>
              <Button
                isIconOnly
                variant={githubVariant}
                color='secondary'
                size='lg'
                as={Link}
                href='https://github.com/reservecrate/memoify'
                isExternal
                onMouseEnter={() => setGithubVariant('flat')}
                onMouseLeave={() => setGithubVariant('bordered')}
              >
                <TfiGithub />
              </Button>
            </div>
          </div>
          <Spacer y={3} />
          <div className='grid grid-cols-8 gap-6'>
            <Memos />
            <Sidebar />
          </div>
        </div>
      ) : (
        <div id='App' className='flex flex-col items-center px-4 h-screen'>
          <h1
            className='text-6xl font-bold leading-snug'
            style={{
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            memoify
          </h1>
          <Spacer y={2} />
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
