import { useState } from 'react';
import { MemoComponentInterface } from '../../../interfaces/Memo';
import { deleteMemo, updateMemo } from '../../../services/memos';
import EditableMemo from './EditableMemo';
import ViewMemo from './ViewMemo';
import { FormElement } from '@nextui-org/react';

const Memo = ({
  title,
  content,
  dateCreated,
  user,
  id,
  memos,
  setMemos,
  token
}: MemoComponentInterface) => {
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
    const { id: deletedMemoId } = await deleteMemo(id, token);
    const memoToDeleteIndex = memos.findIndex(
      memo => memo.id === deletedMemoId
    );
    const memosCopy = JSON.parse(JSON.stringify(memos));
    memosCopy.splice(memoToDeleteIndex, 1);
    setMemos(memosCopy);
  };
  const handleEdit = () => setIsEditable(!isEditable);
  const handleUpdate = async () => {
    return null;
  };

  return isEditable ? (
    <EditableMemo
      title={editableTitle}
      content={editableContent}
      dateCreated={dateCreated}
      user={user}
      id={id}
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
      handleInputChange={handleInputChange}
    />
  ) : (
    <ViewMemo
      title={editableTitle}
      content={editableContent}
      dateCreated={dateCreated}
      user={user}
      id={id}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default Memo;
