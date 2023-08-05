import { useContext } from 'react';
import { Button, Spacer, Chip } from '@nextui-org/react';
import { AppContext } from '../App';

const Logout = () => {
  const { setLoggedInUser, loggedInUser } = useContext(AppContext);

  const handleSignout = () =>
    setLoggedInUser({ username: '', name: '', id: '', token: '' });

  return (
    <div className='flex flex-row justify-evenly items-center w-1/6 h-full'>
      <Chip color='success' size='lg' variant='dot'>
        <p>
          <b>{loggedInUser.username}</b>
        </p>
      </Chip>
      <Button
        color='danger'
        onPressStart={handleSignout}
        className='w-1/3'
        size='sm'
        radius='md'
      >
        <p className='text-sm'>log out</p>
      </Button>
    </div>
  );
};

export default Logout;
