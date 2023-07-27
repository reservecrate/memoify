import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect
} from 'react';
import IMemo from '../../../interfaces/Memo';
import { getMemo, deleteMemo, updateMemo } from '../../../services/memos';
import EditableMemo from './EditableMemo';
import ViewMemo from './ViewMemo';
import { AppContext } from '../../../App';

interface IMemoContext {
  setEditableTitle: Dispatch<SetStateAction<string>>;
  setEditableContent: Dispatch<SetStateAction<string>>;
  handleDelete: () => void;
  handleEdit: () => void;
  handleUpdate: () => void;
  memo: IMemo;
}

const initialMemoContextData = {
  setEditableTitle: () => null,
  setEditableContent: () => null,
  handleDelete: () => null,
  handleEdit: () => null,
  handleUpdate: () => null,
  memo: {
    title: '',
    content: '',
    dateCreated: Date.now(),
    author: {
      username: '',
      name: '',
      id: ''
    },
    id: ''
  }
};

export const MemoContext = createContext<IMemoContext>(initialMemoContextData);

const Memo = ({ memo }: { memo: IMemo }) => {
  const { title, content, id } = memo;
  const { memos, setMemos, loggedInUser, demoMemos, setDemoMemos } =
    useContext(AppContext);
  const [isEditable, setIsEditable] = useState(false);
  const [editableTitle, setEditableTitle] = useState(title);
  const [editableContent, setEditableContent] = useState(content);
  const memoCopy = {
    ...memo,
    title: editableTitle,
    content: editableContent
  };

  useEffect(() => {
    setEditableTitle(title);
    setEditableContent(content);
  }, [title, content]);

  const handleDelete = async () => {
    if (!loggedInUser.token) {
      const deletedDemoMemoIndex = demoMemos.findIndex(memo => memo.id === id);
      const demoMemosCopy = JSON.parse(JSON.stringify(demoMemos));
      demoMemosCopy.splice(deletedDemoMemoIndex, 1);
      setDemoMemos(demoMemosCopy);
    } else {
      try {
        const deletedMemoIndex = memos.findIndex(memo => memo.id === id);
        const memosCopy = JSON.parse(JSON.stringify(memos));
        memosCopy.splice(deletedMemoIndex, 1);
        setMemos(memosCopy);
        await deleteMemo(id, loggedInUser.token);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleEdit = () => setIsEditable(isEditable => !isEditable);

  const handleUpdate = async () => {
    if (!loggedInUser.token) {
      setIsEditable(isEditable => !isEditable);
      const demoMemoToUpdate = demoMemos.find(memo => memo.id === id);
      const updatedDemoMemo = {
        ...demoMemoToUpdate,
        title: editableTitle,
        content: editableContent
      };
      const updatedDemoMemoIndex = demoMemos.findIndex(memo => memo.id === id);
      const demoMemosCopy = JSON.parse(JSON.stringify(demoMemos));
      demoMemosCopy.splice(updatedDemoMemoIndex, 1, updatedDemoMemo);
      setDemoMemos(demoMemosCopy);
    } else {
      try {
        setIsEditable(isEditable => !isEditable);
        const memoToUpdate = await getMemo(id);
        console.log(memoToUpdate);
        const updatedMemoPayload = {
          ...memoToUpdate,
          title: editableTitle,
          content: editableContent
        };
        console.log(updatedMemoPayload);
        await updateMemo(id, updatedMemoPayload, loggedInUser.token);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <MemoContext.Provider
      value={{
        setEditableTitle,
        setEditableContent,
        handleDelete,
        handleEdit,
        handleUpdate,
        memo
      }}
    >
      {isEditable ? (
        <EditableMemo memo={memoCopy} />
      ) : (
        <ViewMemo memo={memoCopy} />
      )}
    </MemoContext.Provider>
  );
};

export default Memo;
