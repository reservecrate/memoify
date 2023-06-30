import axios from 'axios';
import Memo from '../interfaces/Memo';

const baseUrl = 'http://localhost:3004/api/memos';

const getAllMemos = async () => {
  const { data: memos }: { data: Memo[] } = await axios.get(baseUrl);
  return memos;
};

const getMemo = async (id: string) => {
  const { data: memo }: { data: Memo } = await axios.get(`${baseUrl}/${id}`);
  return memo;
};

const createMemo = async (payload: Memo) => {
  const { data: createdMemo }: { data: Memo } = await axios.post(
    baseUrl,
    payload
  );
  return createdMemo;
};

const updateMemo = async (id: string, payload: Memo) => {
  const { data: updatedMemo }: { data: Memo } = await axios.put(
    `${baseUrl}/${id}`,
    payload
  );
  return updatedMemo;
};

const deleteMemo = async (id: string) => {
  const { data: deletedMemo }: { data: Memo } = await axios.delete(
    `${baseUrl}/${id}`
  );
  return deletedMemo;
};

export { getAllMemos, getMemo, createMemo, updateMemo, deleteMemo };
