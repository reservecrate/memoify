import axios from 'axios';
import Memo from '../interfaces/Memo';

const baseUrl = 'http://localhost:3004/api/memos';

const getMemos = async () => {
  const { data: memos }: { data: Memo[] } = await axios.get(baseUrl);
  return memos;
};

const getMemo = async (id: string) => {
  const { data: memo }: { data: Memo } = await axios.get(`${baseUrl}/${id}`);
  return memo;
};

const createMemo = async (
  payload: {
    title: string;
    content: string;
    dateCreated: number;
  },
  token: string
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const { data: createdMemo }: { data: Memo } = await axios.post(
    baseUrl,
    payload,
    config
  );
  return createdMemo;
};

const updateMemo = async (id: string, payload: Memo, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const { data: updatedMemo }: { data: Memo } = await axios.put(
    `${baseUrl}/${id}`,
    payload,
    config
  );
  return updatedMemo;
};

const deleteMemo = async (id: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const { data: deletedMemo }: { data: Memo } = await axios.delete(
    `${baseUrl}/${id}`,
    config
  );
  return deletedMemo;
};

export { getMemos, getMemo, createMemo, updateMemo, deleteMemo };
