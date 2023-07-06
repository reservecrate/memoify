import { useState, useEffect } from 'react';
import Memos from './components/Memos';
import Sidebar from './components/Sidebar';
import { Grid, Container, Text, Spacer, Row } from '@nextui-org/react';
import Memo from './interfaces/Memo';
import { getAllMemos } from './services/memos';

const App = () => {
  const [token, setToken] = useState('');
  //implement client side form checking for faster rendering
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
    <Grid.Container id='App'>
      <Grid xs={9} direction='column'>
        <Row justify='center'>
          <Text h1>memoify</Text>
        </Row>
        <Memos memos={memos} setMemos={setMemos} token={token} />
      </Grid>
      <Grid xs={3} direction='column'>
        <Sidebar setToken={setToken} />
      </Grid>
    </Grid.Container>
  );
};

export default App;
