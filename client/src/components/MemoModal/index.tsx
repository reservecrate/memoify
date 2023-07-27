import { useContext, useState } from 'react';
import { Modal } from '@nextui-org/react';
import ViewMemoModal from './ViewModal';
import EditableMemoModal from './EditableModal';
import IMemo from '../../interfaces/Memo';
import { AppContext } from '../../App';

const MemoModal = ({
  isOpen,
  onClose,
  memo
}: {
  isOpen: boolean;
  onClose: () => void;
  memo: IMemo;
}) => {
  const { loggedInUser, demoMemos, setDemoMemos } = useContext(AppContext);
  const { title, content, id } = memo;
  const [editableModalTitle, setEditableModalTitle] = useState(title);
  const [editableModalContent, setEditableModalContent] = useState(content);
  const [modalIsEditable, setModalIsEditable] = useState(false);

  const handleEdit = () =>
    setModalIsEditable(modalIsEditable => !modalIsEditable);

  const handleUpdate = async () => {
    if (!loggedInUser.token) {
      onClose();
      setModalIsEditable(modalIsEditable => !modalIsEditable);
      const demoMemoToUpdate = demoMemos.find(memo => memo.id === id);
      const updatedDemoMemo = {
        ...demoMemoToUpdate,
        title: editableModalTitle,
        content: editableModalContent
      };
      const updatedDemoMemoIndex = demoMemos.findIndex(memo => memo.id === id);
      const demoMemosCopy = JSON.parse(JSON.stringify(demoMemos));
      demoMemosCopy.splice(updatedDemoMemoIndex, 1, updatedDemoMemo);
      setDemoMemos(demoMemosCopy);
    } else {
      try {
        console.log();
      } catch (err) {
        console.log(err);
      }
    }
  };
  const memoCopy = {
    ...memo,
    title: editableModalTitle,
    content: editableModalContent
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='4xl' backdrop='blur'>
      {modalIsEditable ? (
        <EditableMemoModal
          handleUpdate={handleUpdate}
          memo={memoCopy}
          setEditableModalTitle={setEditableModalTitle}
          setEditableModalContent={setEditableModalContent}
        />
      ) : (
        <ViewMemoModal handleEdit={handleEdit} memo={memoCopy} />
      )}
    </Modal>
  );
};

export default MemoModal;
