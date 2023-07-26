import axios from 'axios';
import IMemo from '../interfaces/Memo';

const baseUrl = 'http://localhost:3004/api/memos';
// const baseUrl = '/api/memos';

export const getMemo = async (id: string) => {
  const { data: memo }: { data: IMemo } = await axios.get(`${baseUrl}/${id}`);
  return memo;
};

export const getMemosByAuthor = async (username: string) => {
  const { data: memos }: { data: IMemo[] } = await axios.get(
    `http://localhost:3004/${username}/memos`
  );
  return memos;
};

export const createMemo = async (
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

export const updateMemo = async (id: string, payload: IMemo, token: string) => {
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

export const deleteMemo = async (id: string, token: string) => {
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

