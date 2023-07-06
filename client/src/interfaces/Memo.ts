import { FormElement } from '@nextui-org/react';

export default interface Memo {
  title: string;
  content: string;
  dateCreated: number;
  user: {
    username: string;
    name: string;
  };
  id: string;
}

export interface MemoComponentInterface extends Memo {
  memos: Memo[];
  setMemos: React.Dispatch<React.SetStateAction<Memo[]>>;
  token: string;
}

export interface ViewMemoComponentInterface extends Memo {
  handleEdit: () => void;
  handleDelete: () => void;
}

export interface EditableMemoComponentInterface extends Memo {
  handleUpdate: () => void;

  handleDelete: () => void;
  handleInputChange: (e: React.ChangeEvent<FormElement>) => void;
}
