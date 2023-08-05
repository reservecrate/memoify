import { useContext, Dispatch, SetStateAction } from 'react';
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spacer,
  Textarea
} from '@nextui-org/react';
import { MemoContext } from '../Memos/Memo';
import IMemo from '../../interfaces/Memo';
import dateFormatter from '../../utils/dateFormatter';

const EditableModal = ({
  handleUpdate,
  memo,
  setEditableModalTitle,
  setEditableModalContent
}: {
  handleUpdate: () => void;
  memo: IMemo;
  setEditableModalTitle: Dispatch<SetStateAction<string>>;
  setEditableModalContent: Dispatch<SetStateAction<string>>;
}) => {
  const { handleDelete } = useContext(MemoContext);
  const { title, content, dateCreated, author } = memo;
  const { formattedDate, formattedTime } = dateFormatter(dateCreated);

  return (
    <ModalContent>
      <ModalHeader className='py-0 pl-2'>
        <Input
          value={title}
          onValueChange={setEditableModalTitle}
          ariaLabel='InputEditableModalTitle'
          variant='underlined'
          isClearable
        />
      </ModalHeader>
      <ModalBody className='py-0 pl-2'>
        <Textarea
          className='w-full h-full'
          variant='underlined'
          value={content}
          onValueChange={setEditableModalContent}
        />
      </ModalBody>
      <ModalFooter className='flex flex-col'>
        <p
          style={{
            background: 'linear-gradient(to right, #4E4FEB, #DB005B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          created on {formattedDate} at {formattedTime} by{' '}
          <b>{author.username}</b>
        </p>
        <Spacer y={2} />
        <div className='flex justify-evenly w-full'>
          <Button
            onPressStart={handleUpdate}
            color='primary'
            variant='flat'
            className='w-5/12'
          >
            save
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

export default EditableModal;
