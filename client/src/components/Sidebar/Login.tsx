import { useState, useContext } from 'react';
import { Input, Button, Spacer, Tooltip } from '@nextui-org/react';
import login from '../../services/login';
import { AppContext } from '../../App';
// import { PiEyeFill, PiEyeClosedFill } from 'react-icons/pi';
import { MdLogin } from 'react-icons/md';

const Login = () => {
  const { setLoggedInUser } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [loginVariant, setLoginVariant] = useState('bordered');

  // const toggleVisibility = () => setIsVisible(!isVisible);

  //ADD TEMPORARY MESSAGE COMPONENT TO NOTIFY THE USER THAT THEY HAVE SUCCESSFULLY LOGGED IN/LOGGED OUT,LATER
  const handleLogin = async () => {
    try {
      const loginPayload = { username, password };
      setLoggedInUser({ username, name: '', id: '', token: '' });
      setUsername('');
      setPassword('');
      const userData = await login(loginPayload);
      setLoggedInUser(userData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='flex flex-col'>
      <Input
        variant='underlined'
        id='InputLoginUsername'
        label='username'
        placeholder=' e.g. reservecrate'
        value={username}
        onValueChange={setUsername}
        isClearable
        color='secondary'
        className='w-5/6'
        isRequired
      />
      <Spacer y={4} />
      <Input
        variant='underlined'
        id='InputLoginPassword'
        label='password'
        placeholder='e.g. password123'
        value={password}
        onValueChange={setPassword}
        isClearable
        color='secondary'
        className='w-5/6'
        isRequired
        // endContent={
        //   <button onClick={toggleVisibility}>
        //     {isVisible ? (
        //       <PiEyeFill className='pointer-events-none' />
        //     ) : (
        //       <PiEyeClosedFill className='pointer-events-none' />
        //     )}
        //   </button>
        // }
        // type={isVisible ? 'text' : 'password'}
        type='password'
      />
      <Spacer y={4} />
      <Tooltip
        content='sign in with your account'
        color='secondary'
        showArrow
        delay={0}
        closeDelay={0}
      >
        <Button
          color='secondary'
          variant={loginVariant}
          onPressStart={handleLogin}
          className='w-6/12'
          endContent={<MdLogin />}
          onMouseEnter={() => setLoginVariant('flat')}
          onMouseLeave={() => setLoginVariant('bordered')}
        >
          log in
        </Button>
      </Tooltip>
    </div>
  );
};

export default Login;
