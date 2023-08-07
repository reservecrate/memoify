import { MdEdit, MdDelete } from 'react-icons/md';
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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ViewModal = ({
  toggleEdit,
  memo,
  gradient
}: {
  toggleEdit: () => void;
  memo: IMemo;
  gradient: string;
}) => {
  const { handleDelete } = useContext(MemoContext);
  const { title, content, dateCreated, author } = memo;
  const { formattedDate, formattedTime } = dateFormatter(dateCreated);

  return (
    <ModalContent>
      <ModalHeader>
        <h2 className='text-4xl font-extrabold'>{title}</h2>
      </ModalHeader>
      <ModalBody className='py-0 px-2'>
        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkGfm]}
          className='whitespace-pre-wrap w-full h-full flex flex-col'
        />
      </ModalBody>
      <ModalFooter className='flex flex-col'>
        <p
          style={{
            background: gradient,
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          created on {formattedDate} at {formattedTime} by{' '}
          <strong className='font-extrabold'>{author.username}</strong>
        </p>
        <Spacer y={2} />
        <div className='flex justify-evenly w-full'>
          <Button
            onPressStart={toggleEdit}
            color='primary'
            variant='flat'
            className='w-5/12'
            endContent={<MdEdit />}
          >
            edit
          </Button>
          <Button
            onPressStart={handleDelete}
            color='danger'
            variant='flat'
            className='w-5/12'
            endContent={<MdDelete />}
          >
            delete
          </Button>
        </div>
      </ModalFooter>
    </ModalContent>
  );
};

export default ViewModal;
