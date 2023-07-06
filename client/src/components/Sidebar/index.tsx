import { Container, Spacer } from '@nextui-org/react';
import Login from './Login';
import Signup from './Signup';

const Sidebar = ({
  setToken
}: {
  setToken: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Container direction='column'>
      <Spacer y={2} />
      <Login setToken={setToken} />
      <Spacer y={2.5}/>
      <Signup />
    </Container>
  );
};

export default Sidebar;
