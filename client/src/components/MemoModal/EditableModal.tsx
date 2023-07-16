import { useContext, Dispatch, SetStateAction } from 'react';
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Spacer
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
      <ModalHeader>
        <Input
          value={title}
          onValueChange={setEditableModalTitle}
          variant='underlined'
          ariaLabel='InputEditableModalTitle'
          isClearable
        />
      </ModalHeader>
      <ModalBody>
        <Textarea
          value={content}
          onValueChange={setEditableModalContent}
          ariaLabel='TextareaEditableModalContent'
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
