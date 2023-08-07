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

const EditableMemo = ({
  memo,
  gradient
}: {
  memo: IMemo;
  gradient: string;
}) => {
  const { title, content, dateCreated, author } = memo;
  const { setEditableTitle, setEditableContent, handleDelete, handleUpdate } =
    useContext(MemoContext);
  const { username } = author;
  const { formattedDate, formattedTime } = dateFormatter(dateCreated);

  return (
    <Card isHoverable className='col-span-1 row-span-1'>
      <CardHeader className='py-0 pl-1'>
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
      <CardBody className='py-0 pl-1'>
        <Textarea
          aria-label='TextareaUpdateContent'
          id='TextareaUpdateContent'
          value={content}
          onValueChange={setEditableContent}
          minRows={5}
          maxRows={5}
          className='w-full h-full'
          variant='underlined'
        />
      </CardBody>
      <Divider />
      <CardFooter className='flex flex-col shrink-0'>
        <p
          style={{
            background: gradient,
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          created on {formattedDate} at {formattedTime} by{' '}
          <strong className='font-extrabold'>{username}</strong>
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
