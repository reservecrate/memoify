import axios from 'axios';
import IMemo from '../interfaces/Memo';

const baseUrl = 'http://localhost:3004/api/memos';
const newBaseUrl = 'http://localhost:3004';

// const getMemos = async () => {
//   const { data: memos }: { data: IMemo[] } = await axios.get(baseUrl);
//   return memos;
// };

const getMemo = async (id: string) => {
  const { data: memo }: { data: IMemo } = await axios.get(`${baseUrl}/${id}`);
  return memo;
};

const getMemosByAuthor = async (username: string) => {
  const { data: memos }: { data: IMemo[] } = await axios.get(
    `${newBaseUrl}/${username}/memos`
  );
  return memos;
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
  const { data: createdMemo }: { data: IMemo } = await axios.post(
    baseUrl,
    payload,
    config
  );
  return createdMemo;
};

const updateMemo = async (id: string, payload: IMemo, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const { data: updatedMemo }: { data: IMemo } = await axios.put(
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
  const { data: deletedMemo }: { data: IMemo } = await axios.delete(
    `${baseUrl}/${id}`,
    config
  );
  return deletedMemo;
};

export { getMemo, getMemosByAuthor, createMemo, updateMemo, deleteMemo };
