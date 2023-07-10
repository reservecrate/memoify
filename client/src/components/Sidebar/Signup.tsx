import { useState } from 'react';
import {
  Container,
  Spacer,
  Input,
  Button,
  FormElement
} from '@nextui-org/react';
import signup from '../../services/signup';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [createdUser, setCreatedUser] = useState({
    username: '',
    name: '',
    passwordHash: ''
  });

  const handleInputChange = (e: React.ChangeEvent<FormElement>) => {
    const inputElement = e.currentTarget.id;
    const inputValue = e.currentTarget.value;
    if (inputElement === 'InputLoginUsername') setUsername(inputValue);
    else if (inputElement === 'InputLoginName') setName(inputValue);
    else if (inputElement === 'InputLoginPassword') setPassword(inputValue);
    else
      console.error(
        'Error. Input not matched (must either be username or password)'
      );
  };

  const handleSignup = async () => {
    try {
      const signupPayload = { username, name, password };
      setUsername('');
      setName('');
      setPassword('');
      const createdUser = await signup(signupPayload);
      setCreatedUser(createdUser);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Input
        underlined
        id='InputLoginUsername'
        labelPlaceholder='username'
        onChange={handleInputChange}
        value={username}
        clearable
      />
      <Spacer y={2} />
      <Input
        underlined
        id='InputLoginName'
        labelPlaceholder='name'
        onChange={handleInputChange}
        value={name}
        clearable
      />
      <Spacer y={2} />
      <Input.Password
        underlined
        id='InputLoginPassword'
        labelPlaceholder='password'
        onChange={handleInputChange}
        value={password}
        clearable
      />
      <Spacer />
      <Button
        color='gradient'
        bordered
        size='sm'
        onPressStart={handleSignup}
        shadow
      >
        {createdUser.username
          ? `successfully created: ${createdUser.username}`
          : 'sign up ÓwÓ'}
      </Button>
    </Container>
  );
};

export default Signup;
