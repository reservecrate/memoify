import { useState } from 'react';
import {
  Container,
  Spacer,
  Input,
  Button,
  FormElement,
  Tooltip
} from '@nextui-org/react';
import signup from '../../services/signup';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);
  const [createdUser, setCreatedUser] = useState({
    username: '',
    name: '',
    passwordHash: ''
  });

  const confirmPasswordLabelPlaceholder = passwordsDoNotMatch
    ? 'your passwords do not match! '
    : 'confirm password owo';

  const handleInputChange = (e: React.ChangeEvent<FormElement>) => {
    const inputElement = e.currentTarget.id;
    const inputValue = e.currentTarget.value;
    if (inputElement === 'InputLoginUsername') setUsername(inputValue);
    else if (inputElement === 'InputLoginName') setName(inputValue);
    else if (inputElement === 'InputLoginPassword') {
      inputValue === confirmPassword ? setPasswordsDoNotMatch(false) : null;
      setPassword(inputValue);
    } else if (inputElement === 'InputLoginPasswordConfirm') {
      inputValue !== password
        ? setPasswordsDoNotMatch(true)
        : setPasswordsDoNotMatch(false);
      setConfirmPassword(inputValue);
    } else
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
        labelPlaceholder='username uwu'
        onChange={handleInputChange}
        value={username}
        clearable
        color='secondary'
      />
      <Spacer y={2} />
      <Input
        underlined
        id='InputLoginName'
        labelPlaceholder='name uwu'
        onChange={handleInputChange}
        value={name}
        clearable
        color='secondary'
      />
      <Spacer y={2} />
      <Input.Password
        underlined
        id='InputLoginPassword'
        labelPlaceholder='password owo'
        onChange={handleInputChange}
        value={password}
        clearable
        color='secondary'
      />
      <Spacer y={2} />
      <Input.Password
        underlined
        id='InputLoginPasswordConfirm'
        labelPlaceholder={confirmPasswordLabelPlaceholder}
        onChange={handleInputChange}
        value={confirmPassword}
        clearable
        color='secondary'
        status={passwordsDoNotMatch ? 'error' : 'default'}
      />
      <Spacer y={1.5} />
      <Tooltip
        content='sign up for a memoify account! ÓwÓ'
        contentColor=''
        color='secondary'
        rounded
        css={{}}
      >
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
      </Tooltip>
    </Container>
  );
};

export default Signup;
