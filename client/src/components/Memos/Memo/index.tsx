import { createContext, useState, useContext } from 'react';
import IMemo from '../../../interfaces/Memo';
import { getMemo, deleteMemo, updateMemo } from '../../../services/memos';
import EditableMemo from './EditableMemo';
import ViewMemo from './ViewMemo';
import { FormElement } from '@nextui-org/react';
import { AppContext } from '../../../App';

interface IMemoContext {
  handleInputChange: (e: React.ChangeEvent<FormElement>) => void;
  handleDelete: () => void;
  handleEdit: () => void;
  handleUpdate: () => void;
}

const initialMemoContextData = {
  handleInputChange: () => null,
  handleDelete: () => null,
  handleEdit: () => null,
  handleUpdate: () => null
};

export const MemoContext = createContext<IMemoContext>(initialMemoContextData);

const Memo = ({ title, content, dateCreated, user, id }: IMemo) => {
  const { loggedInUser, memos, setMemos } = useContext(AppContext);
  const [isEditable, setIsEditable] = useState(false);
  const [editableTitle, setEditableTitle] = useState(title);
  const [editableContent, setEditableContent] = useState(content);

  const handleInputChange = (e: React.ChangeEvent<FormElement>) => {
    const inputElement = e.currentTarget.id;
    const inputValue = e.currentTarget.value;
    if (inputElement === 'InputUpdateTitle') setEditableTitle(inputValue);
    else if (inputElement === 'TextareaUpdateContent')
      setEditableContent(inputValue);
  };
  const handleDelete = async () => {
    const { id: deletedMemoId } = await deleteMemo(id, loggedInUser.token);
    const deletedMemoIndex = memos.findIndex(memo => memo.id === deletedMemoId);
    const memosCopy = JSON.parse(JSON.stringify(memos));
    memosCopy.splice(deletedMemoIndex, 1);
    setMemos(memosCopy);
  };
  const handleEdit = () => setIsEditable(isEditable => !isEditable);
  const handleUpdate = async () => {
    try {
      setIsEditable(isEditable => !isEditable);
      const memoToUpdate = await getMemo(id);
      const updatedMemoPayload = {
        ...memoToUpdate,
        title: editableTitle,
        content: editableContent
      };
      const updatedMemo = await updateMemo(
        id,
        updatedMemoPayload,
        loggedInUser.token
      );
      const { id: updatedMemoId } = updatedMemo;
      const updatedMemoIndex = memos.findIndex(
        memo => memo.id === updatedMemoId
      );
      const memosCopy = JSON.parse(JSON.stringify(memos));
      memosCopy.splice(updatedMemoIndex, 1, updatedMemo);
      setMemos(memosCopy);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MemoContext.Provider
      value={{ handleInputChange, handleDelete, handleEdit, handleUpdate }}
    >
      {isEditable ? (
        <EditableMemo
          title={editableTitle}
          content={editableContent}
          dateCreated={dateCreated}
          user={user}
          id={id}
        />
      ) : (
        <ViewMemo
          title={editableTitle}
          content={editableContent}
          dateCreated={dateCreated}
          user={user}
          id={id}
        />
      )}
    </MemoContext.Provider>
  );
};

export default Memo;
