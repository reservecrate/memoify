import { MdEdit, MdDelete } from 'react-icons/md';
import { useContext } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Spacer,
  Divider,
  useDisclosure
} from '@nextui-org/react';
import IMemo from '../../../interfaces/Memo';
import { MemoContext } from '.';
import dateFormatter from '../../../utils/dateFormatter';
import MemoModal from '../../MemoModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ViewMemo = ({ memo }: { memo: IMemo }) => {
  const { title, content, dateCreated, author } = memo;
  const { toggleEdit, handleDelete } = useContext(MemoContext);
  const { formattedDate, formattedTime } = dateFormatter(dateCreated);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Card
        isPressable
        isHoverable
        onPressStart={onOpen}
        className='col-span-1 row-span-1'
      >
        <CardHeader className='flex justify-center py-0'>
          <h2 className='text-3xl font-bold line-clamp-2 py-1'>{title}</h2>
        </CardHeader>
        <Divider />
        <CardBody className='p-2'>
          <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            className='whitespace-pre-wrap w-full h-full flex flex-col'
          />
        </CardBody>
        <Divider />
        <CardFooter className='flex flex-col items-center shrink-0'>
          <p
            style={{
              background: 'linear-gradient(to right, #4E4FEB, #DB005B)',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            created on {formattedDate} at {formattedTime} by{' '}
            <b>{author.username}</b>
          </p>
          <Spacer y={2} />
          <div className='flex justify-evenly w-full'>
            <Button
              onPressStart={toggleEdit}
              color='primary'
              variant='flat'
              className='w-1/3'
              endContent={<MdEdit />}
            >
              edit
            </Button>
            <Button
              onPressStart={handleDelete}
              color='danger'
              variant='flat'
              className='w-1/3'
              endContent={<MdDelete />}
            >
              delete
            </Button>
          </div>
        </CardFooter>
      </Card>
      <MemoModal isOpen={isOpen} onClose={onClose} memo={memo} />
    </>
  );
};
export default ViewMemo;
