import { useContext } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Textarea,
  Spacer,
  Divider
} from '@nextui-org/react';
import IMemo from '../../../interfaces/Memo';
import { MemoContext } from '.';
import dateFormatter from '../../../utils/dateFormatter';

const EditableMemo = ({ memo }: { memo: IMemo }) => {
  const { title, content, dateCreated, author } = memo;
  const { setEditableTitle, setEditableContent, handleDelete, handleUpdate } =
    useContext(MemoContext);
  const { username } = author;
  const { formattedDate, formattedTime } = dateFormatter(dateCreated);

  return (
    <Card isHoverable>
      <CardHeader>
        <Input
          aria-label='InputUpdateTitle'
          id='InputUpdateTitle'
          value={title}
          onValueChange={setEditableTitle}
          isClearable
          variant='underlined'
        />
      </CardHeader>
      <Divider />
      <CardBody>
        <Textarea
          aria-label='TextareaUpdateContent'
          id='TextareaUpdateContent'
          value={content}
          onValueChange={setEditableContent}
          minRows={6}
          maxRows={10}
        />
      </CardBody>
      <Divider />
      <CardFooter className='flex flex-col'>
        <p
          style={{
            background: 'linear-gradient(to right, #4E4FEB, #DB005B)',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          created on {formattedDate} at {formattedTime} by <b>{username}</b>
        </p>
        <Spacer y={2} />
        <div className='flex justify-evenly w-full'>
          <Button
            onPressStart={handleUpdate}
            color='primary'
            variant='flat'
            className='w-1/3'
          >
            save
          </Button>
          <Button
            onPressStart={handleDelete}
            color='danger'
            variant='flat'
            className='w-1/3'
          >
            delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EditableMemo;
