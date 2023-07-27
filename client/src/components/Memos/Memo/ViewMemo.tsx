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
  useDisclosure,
  Skeleton
} from '@nextui-org/react';
import IMemo from '../../../interfaces/Memo';
import { MemoContext } from '.';
import dateFormatter from '../../../utils/dateFormatter';
import MemoModal from '../../MemoModal';
import MDParser from '../../../utils/MDParser';

const ViewMemo = ({ memo }: { memo: IMemo }) => {
  const { title, content, dateCreated, author } = memo;
  const { handleEdit, handleDelete } = useContext(MemoContext);
  const { formattedDate, formattedTime } = dateFormatter(dateCreated);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const richContent = MDParser(content);

  return (
    <>
      <Card
        isPressable
        isHoverable
        onPressStart={onOpen}
        className='col-span-1'
      >
        <CardHeader className='flex justify-center'>
          <p className='text-lg font-semibold'>{title}</p>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className='whitespace-pre-wrap line-clamp-6'>{richContent}</p>
        </CardBody>
        <Divider />
        <CardFooter className='flex flex-col items-center'>
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
              onPressStart={handleEdit}
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
