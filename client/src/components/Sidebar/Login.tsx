import { useState, useContext } from 'react';
import {
  Container,
  Input,
  Tooltip,
  Button,
  FormElement,
  Spacer,
  Text
} from '@nextui-org/react';
import login from '../../services/login';
import { AppContext } from '../../App';

const Login = () => {
  const { setLoggedInUser, memoifiedUser } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [user, setUser] = useState({ username: '', isLoggedIn: false });

  const handleInputChange = (e: React.ChangeEvent<FormElement>) => {
    const inputElement = e.currentTarget.id;
    const inputValue = e.currentTarget.value;
    if (inputElement === 'InputSignupUsername') setUsername(inputValue);
    else if (inputElement === 'InputSignupPassword') setPassword(inputValue);
    else
      console.error(
        'Error. Input not matched (must either be username or password)'
      );
  };
  //ADD TEMPORARY MESSAGE COMPONENT TO NOTIFY THE USER THAT THEY HAVE SUCCESSFULLY LOGGED IN/LOGGED OUT,LATER
  const handleLogin = async () => {
    try {
      const loginPayload = { username, password };
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
    <Container>
      <Input
        underlined
        id='InputSignupUsername'
        labelPlaceholder='username'
        onChange={handleInputChange}
        value={username}
        clearable
      />
      <Spacer y={2} />
      <Input.Password
        underlined
        id='InputSignupPassword'
        labelPlaceholder='password'
        onChange={handleInputChange}
        value={password}
        clearable
      />
      <Spacer />
      {memoifiedUser.token ? (
        <Tooltip content='your account username' color='secondary'>
          <Button flat color='primary'>
            <Text>
              logged in as: <b>{memoifiedUser.username}</b>
            </Text>
          </Button>
          <Spacer />
          <Button
            color='gradient'
            shadow
            size='sm'
            onPressStart={handleSignout}
          >
            log out
          </Button>
        </Tooltip>
      ) : (
        <Button
          color='gradient'
          bordered
          size='sm'
          onPressStart={handleLogin}
          shadow
        >
          log in
        </Button>
      )}
    </Container>
  );
};

export default Login;
