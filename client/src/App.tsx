import Memos from './components/Memos';
import { Container, Text } from '@nextui-org/react';

const App = () => {
  return (
    <Container id='App'>
      <Text h1>memoify</Text>
      <Memos />
    </Container>
  );
};

export default App;
