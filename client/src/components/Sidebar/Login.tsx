import { useState, useContext } from 'react';
import { Input, Button, Spacer, Chip } from '@nextui-org/react';
import login from '../../services/login';
import { AppContext } from '../../App';

const Login = () => {
  const { setLoggedInUser, loggedInUser } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
  const handleSignout = async () => {
    setLoggedInUser({ username: '', name: '', id: '', token: '' });
  };

  return (
    <div>
      {loggedInUser.token ? (
        <>
          <Spacer y={1.5} />
          <Chip color='success' size='lg' variant='dot'>
            <p>
              logged in as: <b>{loggedInUser.username}</b>
            </p>
          </Chip>
          <Spacer y={4} />
          <Button
            color='danger'
            onPressStart={handleSignout}
            className='w-6/12'
          >
            log out
          </Button>
        </>
      ) : (
        <>
          <Input
            variant='underlined'
            id='InputSignupUsername'
            label='username'
            placeholder=' e.g. reservecrate'
            value={username}
            onValueChange={setUsername}
            isClearable
            color='secondary'
            className='w-5/6'
          />
          <Spacer y={4} />
          <Input
            type='password'
            variant='underlined'
            id='InputSignupPassword'
            label='password'
            placeholder='e.g. password123'
            value={password}
            onValueChange={setPassword}
            isClearable
            color='secondary'
            className='w-5/6'
          />
          <Spacer y={4} />
          <Button
            color='secondary'
            variant='bordered'
            onPressStart={handleLogin}
            className='w-6/12'
          >
            log in
          </Button>
        </>
      )}
    </div>
  );
};

export default Login;
