import { useContext } from 'react';
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spacer
} from '@nextui-org/react';
import { MemoContext } from '../Memos/Memo';
import dateFormatter from '../../utils/dateFormatter';
import IMemo from '../../interfaces/Memo';

const ViewModal = ({
  handleEdit,
  memo
}: {
  handleEdit: () => void;
  memo: IMemo;
}) => {
  const { handleDelete } = useContext(MemoContext);
  const { title, content, dateCreated, author } = memo;
  const { formattedDate, formattedTime } = dateFormatter(dateCreated);
  return (
    <ModalContent>
      <ModalHeader>
        <p className='text-lg font-semibold'>{title}</p>
      </ModalHeader>
      <ModalBody>
        <p className='whitespace-pre-wrap'>{content}</p>
      </ModalBody>
      <ModalFooter className='flex flex-col'>
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
            className='w-5/12'
          >
            edit
          </Button>
          <Button
            onPressStart={handleDelete}
            color='danger'
            variant='flat'
            className='w-5/12'
          >
            delete
          </Button>
        </div>
      </ModalFooter>
    </ModalContent>
  );
};

export default ViewModal;
