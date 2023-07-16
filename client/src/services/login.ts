import axios from 'axios';

const baseUrl = 'http://localhost:3004/api/login';
// const baseUrl = '/api/login';

const login = async (loginPayload: { username: string; password: string }) => {
  const {
    data: loginData
  }: { data: { username: string; name: string; token: string; id: string } } =
    await axios.post(baseUrl, loginPayload);
  return loginData;
};

export default login;
