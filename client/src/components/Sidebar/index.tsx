import { Container, Spacer } from '@nextui-org/react';
import Login from './Login';
import Signup from './Signup';

const Sidebar = () => {
  return (
    <Container direction='column'>
      <Spacer y={2} />
      <Login />
      <Spacer y={2.5} />
      <Signup />
    </Container>
  );
};

export default Sidebar;
