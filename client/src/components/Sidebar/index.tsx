import { Spacer } from '@nextui-org/react';
import Login from './Login';
import Signup from './Signup';

const Sidebar = () => {
  return (
    <div className='col-span-1 flex flex-col'>
      <Login />
      <Spacer y={12} />
      <Signup />
    </div>
  );
};

export default Sidebar;
