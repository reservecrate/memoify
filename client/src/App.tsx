import { useState, useEffect } from 'react';
import Memos from './components/Memos';
import Login from './components/Login';
import CreateMemo from './components/CreateMemo';
import { Container, Text, Spacer } from '@nextui-org/react';
import Memo from './interfaces/Memo';
import { getAllMemos } from './services/memos';

const App = () => {
  const [token, setToken] = useState('');
  const [memos, setMemos] = useState<Memo[]>([]);

  const hook = () => {
    (async () => {
      try {
        const memosData = await getAllMemos();
        setMemos(memosData);
      } catch (err) {
        console.error(err);
      }
    })();
  };

  useEffect(hook, []);

  return (
    <Container id='App'>
      <Text h1>memoify</Text>
      <Memos memos={memos} setMemos={setMemos} token={token} />
      <Spacer y={2} />
      <Login setToken={setToken} />
      <Spacer y={2} />
      <CreateMemo memos={memos} setMemos={setMemos} token={token} />
    </Container>
  );
};

export default App;
