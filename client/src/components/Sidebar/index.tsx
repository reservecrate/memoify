import { useContext } from 'react';
import { Spacer } from '@nextui-org/react';
import Login from './Login';
import Signup from './Signup';
import { AppContext } from '../../App';

const Sidebar = () => {
  const { loggedInUser } = useContext(AppContext);

  return (
    <div className='col-span-1 flex flex-col'>
      {loggedInUser.token ? (
        <>
          <Spacer y={8} />
          <Login />
        </>
      ) : (
        <>
          <Spacer y={8} />
          <Login />
          <Spacer y={12} />
          <Signup />
        </>
      )}
    </div>
  );
};

export default Sidebar;
