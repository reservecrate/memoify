import { useContext, useState } from 'react';
import {
  Container,
  Input,
  Textarea,
  Button,
  FormElement,
  Spacer
} from '@nextui-org/react';
import { createMemo } from '../../services/memos';
import { AppContext } from '../../App';

const CreateMemo = () => {
  const { memos, setMemos, loggedInUser } =
    useContext(AppContext);
  const { demoMemos, setDemoMemos } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleInputChange = (e: React.ChangeEvent<FormElement>) => {
    const inputElement = e.currentTarget.id;
    const inputValue = e.currentTarget.value;
    if (inputElement === 'InputTitle') setTitle(inputValue);
    else if (inputElement === 'TextareaContent') setContent(inputValue);
  };
  //ADD TEMPORARY MESSAGE COMPONENT TO NOTIFY THE USER WHEN THEY HAVE SUCCESSFULLY CREATED A NEW MEMO, LATER
  const handleCreate = async () => {
    if (!loggedInUser.token) {
      const tempMemo = {
        title,
        content,
        dateCreated: Date.now(),
        author: { username: 'Incognito', name: '', id: '' },
        id: 'tempDemoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
      };
      setTitle('');
      setContent('');
      setDemoMemos([...demoMemos, tempMemo]);
    } else {
      try {
        const memoToCreate = {
          title,
          content,
          dateCreated: Date.now(),
          author: {
            username: loggedInUser.username,
            name: loggedInUser.name,
            id: loggedInUser.id
          },
          id: 'tempMemoId' + Date.now() + Math.floor(Math.random() * 9999)
        };
        setTitle('');
        setContent('');
        setMemos([...memos, memoToCreate]);
        const createdMemo = await createMemo(memoToCreate, loggedInUser.token);
        setMemos([...memos, createdMemo]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Container direction='column'>
      <Input
        id='InputTitle'
        labelPlaceholder='title'
        onChange={handleInputChange}
        value={title}
        clearable
        bordered
        color='secondary'
      />
      <Spacer y={0.5} />
      <Textarea
        id='TextareaContent'
        label="what's on your mind?"
        placeholder='content'
        onChange={handleInputChange}
        value={content}
        minRows={5}
        maxRows={10}
        bordered
        color='secondary'
      />
      <Spacer />
      <Button color='gradient' bordered onPressStart={handleCreate} shadow>
        create memo
      </Button>
    </Container>
  );
};

export default CreateMemo;
