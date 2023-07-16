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

const ViewMemo = ({ memo }: { memo: IMemo }) => {
  const { title, content, dateCreated, author } = memo;
  const { handleEdit, handleDelete } = useContext(MemoContext);
  const { formattedDate, formattedTime } = dateFormatter(dateCreated);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className='col-span-1'>
      <Card isPressable isHoverable onPressStart={onOpen}>
        <CardHeader className='flex justify-center'>
          <p className='text-lg font-semibold'>{title}</p>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className='whitespace-pre-wrap'>{content}</p>
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
            >
              edit
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
      <MemoModal isOpen={isOpen} onClose={onClose} memo={memo} />
    </div>
  );
};
export default ViewMemo;
