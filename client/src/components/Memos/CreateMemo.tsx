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
  const { memos, setMemos, loggedInUser } = useContext(AppContext);
  const { demoMemos, setDemoMemos } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [titleIsVoid, setTitleIsVoid] = useState(false);
  const [content, setContent] = useState('');
  const [contentIsVoid, setContentIsVoid] = useState(false);

  const titleLabelPlaceholder = titleIsVoid
    ? 'the title field must not be empty! ÙwÚ'
    : 'title uwu';

  const contentLabel = contentIsVoid
    ? 'the content field must not be empty! ÒwÓ'
    : "what's on your mind? O w O";

  const handleInputChange = (e: React.ChangeEvent<FormElement>) => {
    const inputElement = e.currentTarget.id;
    const inputValue = e.currentTarget.value;
    if (inputElement === 'InputTitle') {
      !inputValue ? setTitleIsVoid(true) : setTitleIsVoid(false);
      setTitle(inputValue);
    } else if (inputElement === 'TextareaContent') {
      !inputValue ? setContentIsVoid(true) : setContentIsVoid(false);
      setContent(inputValue);
    }
  };
  //ADD TEMPORARY MESSAGE COMPONENT TO NOTIFY THE USER WHEN THEY HAVE SUCCESSFULLY CREATED A NEW MEMO, LATER
  const handleCreate = async () => {
    if (titleIsVoid || contentIsVoid) return;
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
        labelPlaceholder={titleLabelPlaceholder}
        onChange={handleInputChange}
        value={title}
        clearable
        bordered
        color='secondary'
        css={{ width: '100%' }}
        status={titleIsVoid ? 'error' : 'default'}
      />
      <Spacer y={0.5} />
      <Textarea
        id='TextareaContent'
        label={contentLabel}
        placeholder='content owo'
        onChange={handleInputChange}
        value={content}
        minRows={5}
        maxRows={10}
        bordered
        color='secondary'
        css={{ width: '100%' }}
        status={contentIsVoid ? 'error' : 'default'}
      />
      <Spacer />
      <Button
        color='gradient'
        bordered
        onPressStart={handleCreate}
        shadow
        css={{ width: '100%' }}
      >
        create memo UwU
      </Button>
    </Container>
  );
};

export default CreateMemo;
