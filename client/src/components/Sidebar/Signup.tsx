import { useState, useEffect } from 'react';
import { Spacer, Input, Button, Chip } from '@nextui-org/react';
import signup from '../../services/signup';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [usernameIsTooShort, setUsernameIsTooShort] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordIsTooShort, setPasswordIsTooShort] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);
  const [createdUser, setCreatedUser] = useState('');

  const usernameLabelPlaceholder = usernameIsTooShort
    ? 'your username is too short!'
    : 'username';
  const passwordLabelPlaceholder = passwordIsTooShort
    ? 'your password is too short!'
    : 'password';

  const confirmPasswordLabelPlaceholder = passwordsDoNotMatch
    ? 'your passwords do not match!'
    : 'confirm password';

  useEffect(() => {
    if (username.length >= 1 && username.length < 3)
      setUsernameIsTooShort(true);
    else setUsernameIsTooShort(false);
  }, [username]);
  useEffect(() => {
    if (password.length >= 1 && password.length < 5)
      setPasswordIsTooShort(true);
    else setPasswordIsTooShort(false);
  }, [password]);
  useEffect(() => {
    if (confirmPassword !== password) setPasswordsDoNotMatch(true);
    else setPasswordsDoNotMatch(false);
  }, [confirmPassword]);

  const handleSignup = async () => {
    try {
      const signupPayload = { username, name, password };
      setUsername('');
      setName('');
      setPassword('');
      setConfirmPassword('');
      const createdUser = await signup(signupPayload);
      setCreatedUser(createdUser.username);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {createdUser ? (
        <Chip color='success' variant='faded'>
          successfully created: {createdUser}
        </Chip>
      ) : (
        <div>
          <Input
            variant='underlined'
            id='InputLoginUsername'
            label={usernameLabelPlaceholder}
            placeholder='e.g. reservecrate'
            value={username}
            onValueChange={setUsername}
            isClearable
            color={usernameIsTooShort ? 'danger' : 'secondary'}
            className='w-5/6'
            isRequired
          />
          <Spacer y={4} />
          <Input
            variant='underlined'
            id='InputLoginName'
            label='name'
            placeholder='e.g. Aldi'
            value={name}
            onValueChange={setName}
            isClearable
            color='secondary'
            className='w-5/6'
          />
          <Spacer y={4} />
          <Input
            type='password'
            variant='underlined'
            id='InputLoginPassword'
            label={passwordLabelPlaceholder}
            placeholder='e.g. password123'
            value={password}
            onValueChange={setPassword}
            isClearable
            color={passwordIsTooShort ? 'danger' : 'secondary'}
            className='w-5/6'
            isRequired
          />
          <Spacer y={4} />
          <Input
            type='password'
            variant='underlined'
            id='InputLoginPasswordConfirm'
            label={confirmPasswordLabelPlaceholder}
            placeholder='password123'
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            isClearable
            color={passwordsDoNotMatch ? 'danger' : 'secondary'}
            className='w-5/6'
            isRequired
          />
          <Spacer y={4} />
          <Button
            color='secondary'
            variant='bordered'
            onPressStart={handleSignup}
            className='w-6/12'
          >
            sign up
          </Button>
        </div>
      )}
    </div>
  );
};

export default Signup;
