import { useContext, useState } from 'react';
import { Modal } from '@nextui-org/react';
import ViewMemoModal from './ViewModal';
import EditableMemoModal from './EditableModal';
import IMemo from '../../interfaces/Memo';
import { AppContext } from '../../App';
import { MemosContext } from '../Memos';
import { getMemo, deleteMemo, updateMemo } from '../../services/memos';

const MemoModal = ({
  isOpen,
  onClose,
  memo
}: {
  isOpen: boolean;
  onClose: () => void;
  memo: IMemo;
}) => {
  const { loggedInUser } = useContext(AppContext);
  const { memos, setMemos, demoMemos, setDemoMemos } = useContext(MemosContext);
  const { title, content, id } = memo;
  const [editableModalTitle, setEditableModalTitle] = useState(title);
  const [editableModalContent, setEditableModalContent] = useState(content);
  const [modalIsEditable, setModalIsEditable] = useState(false);

  const toggleEdit = () =>
    setModalIsEditable(modalIsEditable => !modalIsEditable);

  const handleUpdate = async () => {
    if (!loggedInUser.token) {
      onClose();
      toggleEdit();
      const demoMemoToUpdate = demoMemos.find(memo => memo.id === id);
      const updatedDemoMemo = {
        ...demoMemoToUpdate,
        title: editableModalTitle.trim(),
        content: editableModalContent.trim().replace(/\n{2,}/g, '\n')
      };
      const updatedDemoMemoIndex = demoMemos.findIndex(memo => memo.id === id);
      const demoMemosCopy = JSON.parse(JSON.stringify(demoMemos));
      demoMemosCopy.splice(updatedDemoMemoIndex, 1, updatedDemoMemo);
      setDemoMemos(demoMemosCopy);
    } else {
      try {
        onClose();
        toggleEdit();
        const tempMemoToUpdate = memos.find(memo => memo.id === id);
        const tempUpdatedMemo = {
          ...tempMemoToUpdate,
          title: editableModalTitle.trim(),
          content: editableModalContent.trim().replace(/\n{2,}/g, '\n')
        };
        const updatedTempMemoIndex = memos.findIndex(memo => memo.id === id);
        const memosCopy = JSON.parse(JSON.stringify(memos));
        memosCopy.splice(updatedTempMemoIndex, 1, tempUpdatedMemo);
        setMemos(memosCopy);

        const memoToUpdate = await getMemo(id);
        const updatedMemoPayload = {
          ...memoToUpdate,
          title: editableModalTitle.trim(),
          content: editableModalContent.trim().replace(/\n{2,}/g, '\n')
        };
        await updateMemo(id, updatedMemoPayload, loggedInUser.token);
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
        <ViewMemoModal toggleEdit={toggleEdit} memo={memoCopy} />
      )}
    </Modal>
  );
};

export default MemoModal;
