import { useContext, useState } from 'react';
import { Input, Textarea, Button, Spacer, Tooltip } from '@nextui-org/react';
import { createMemo } from '../../services/memos';
import { AppContext } from '../../App';
import { MemosContext } from '.';
import { MdAddCircle } from 'react-icons/md';

const CreateMemo = () => {
  const { loggedInUser } = useContext(AppContext);
  const { memos, setMemos, demoMemos, setDemoMemos } = useContext(MemosContext);

  const [title, setTitle] = useState('');
  const [titleIsVoid, setTitleIsVoid] = useState(false);
  const [content, setContent] = useState('');
  const [contentIsVoid, setContentIsVoid] = useState(false);
  const[createVariant,setCreateVariant]=useState('flat')

  const titleLabelPlaceholder = titleIsVoid
    ? 'the title field must not be empty'
    : 'title';

  const contentLabel = contentIsVoid
    ? 'the body field must not be empty'
    : 'body';

  //ADD TEMPORARY MESSAGE COMPONENT TO NOTIFY THE USER WHEN THEY HAVE SUCCESSFULLY CREATED A NEW MEMO, LATER
  const handleCreate = async () => {
    if (!title && !content) {
      setTitleIsVoid(true);
      setContentIsVoid(true);
      return;
    } else if (!title) {
      setTitleIsVoid(true);
      return;
    } else if (!content) {
      setContentIsVoid(true);
      return;
    }
    if (!loggedInUser.token) {
      setTitleIsVoid(false);
      setContentIsVoid(false);
      const tempMemo = {
        title,
        content,
        dateCreated: Date.now(),
        author: { username: 'incognito', name: '', id: '' },
        id: 'tempDemoMemoId' + Date.now() + Math.floor(Math.random() * 9999)
      };
      setTitle('');
      setContent('');
      setDemoMemos([...demoMemos, tempMemo]);
    } else {
      try {
        setTitleIsVoid(false);
        setContentIsVoid(false);
        const memoToCreate = { title, content, dateCreated: Date.now() };
        const tempMemo = {
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
        setMemos([...memos, tempMemo]);
        const createdMemo = await createMemo(memoToCreate, loggedInUser.token);
        setMemos([...memos, createdMemo]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className='col-span-1 row-span-1'>
      <Input
        id='InputTitle'
        variant='bordered'
        label={titleLabelPlaceholder}
        placeholder='e.g. shopping list'
        value={title}
        onValueChange={setTitle}
        isClearable
        isRequired
        color={titleIsVoid ? 'danger' : 'secondary'}
      />
      <Spacer y={3} />
      <Textarea
        id='TextareaContent'
        variant='bordered'
        label={contentLabel}
        placeholder='e.g. eggs, bananas, onions'
        value={content}
        onValueChange={setContent}
        minRows={6}
        maxRows={8}
        color={contentIsVoid ? 'danger' : 'secondary'}
        isRequired
      />
      <Spacer y={3} />
      <Tooltip
        content='create a new memo'
        showArrow
        color='primary'
        delay={0}
        closeDelay={0}
      >
        <Button
          color='primary'
          onPressStart={handleCreate}
          className='w-full'
          variant={createVariant}
          endContent={<MdAddCircle />}
          onMouseEnter={()=>setCreateVariant('solid')}
          onMouseLeave={()=>setCreateVariant('flat')}
        >
          create memo
        </Button>
      </Tooltip>
    </div>
  );
};

export default CreateMemo;
