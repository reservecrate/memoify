import { Container, Spacer } from '@nextui-org/react';
import Login from './Login';
import Signup from './Signup';

const Sidebar = ({
  setToken
}: {
  setToken: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Container>
      <Spacer y={2} />
      <Login setToken={setToken} />
      <Signup />
    </Container>
  );
};

export default Sidebar;
