import { useState, useContext } from 'react';
import { Button, Chip, Tooltip } from '@nextui-org/react';
import { AppContext } from '../App';
import { MdLogout, MdAccountCircle } from 'react-icons/md';

const Logout = () => {
  const { setLoggedInUser, loggedInUser } = useContext(AppContext);
  const [logoutVariant, setLogoutVariant] = useState('bordered');

  const handleSignout = () =>
    setLoggedInUser({ username: '', name: '', id: '', token: '' });

  return (
    <div className='flex flex-row justify-evenly items-center w-1/6 h-full'>
      <Tooltip
        content='your username'
        showArrow
        color='secondary'
        delay={0}
        closeDelay={0}
      >
        <Chip
          color='secondary'
          size='lg'
          variant='bordered'
          startContent={<MdAccountCircle />}
        >
          <strong className='font-extrabold'>{loggedInUser.username}</strong>
        </Chip>
      </Tooltip>
      <Tooltip
        content='sign out of your account'
        showArrow
        color='danger'
        delay={0}
        closeDelay={0}
      >
        <Button
          color='danger'
          onPressStart={handleSignout}
          className='w-1/3 text-sm'
          size='sm'
          radius='md'
          endContent={<MdLogout />}
          variant={logoutVariant}
          onMouseEnter={() => setLogoutVariant('flat')}
          onMouseLeave={() => setLogoutVariant('bordered')}
        >
          log out
        </Button>
      </Tooltip>
    </div>
  );
};

export default Logout;
