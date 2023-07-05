import { useState } from 'react';
import {
  Container,
  Input,
  Button,
  FormElement,
  Spacer,
  Text
} from '@nextui-org/react';
import login from '../services/login';

const Login = ({
  setToken
}: {
  setToken: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({ username: '', isLoggedIn: false });

  const handleInputChange = (e: React.ChangeEvent<FormElement>) => {
    const inputElement = e.currentTarget.id;
    const inputValue = e.currentTarget.value;
    if (inputElement === 'InputUsername') setUsername(inputValue);
    else if (inputElement === 'InputPassword') setPassword(inputValue);
    else
      console.error(
        'Error. Input not matched (must either be username or password)'
      );
  };
  //ADD TEMPORARY MESSAGE COMPONENT TO NOTIFY THE USER THAT THEY HAVE SUCCESSFULLY LOGGED IN/LOGGED OUT,LATER
  const handleLogin = async () => {
    try {
      const loginPayload = { username, password };
      const token = await login(loginPayload);
      setToken(token);
      setUser({ ...user, username, isLoggedIn: !user.isLoggedIn });
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error(err);
    }
  };
  const handleSignout = async () => {
    setToken('');
    setUser({ ...user, username: '', isLoggedIn: false });
  };

  return (
    <Container>
      <Input
        underlined
        id='InputUsername'
        labelPlaceholder='username'
        onChange={handleInputChange}
        value={username}
      />
      <Spacer y={2} />
      <Input.Password
        underlined
        id='InputPassword'
        labelPlaceholder='password'
        onChange={handleInputChange}
        value={password}
      />
      <Spacer />
      <Button color='gradient' bordered size='sm' onPressStart={handleLogin}>
        {user.isLoggedIn ? (
          <Text>
            logged in as: <b>{user.username}</b>
          </Text>
        ) : (
          'log in'
        )}
      </Button>
      {user.isLoggedIn ? (
        <>
          <Spacer />
          <Button
            color='gradient'
            shadow
            size='sm'
            onPressStart={handleSignout}
          >
            log out
          </Button>
        </>
      ) : null}
    </Container>
  );
};

export default Login;
