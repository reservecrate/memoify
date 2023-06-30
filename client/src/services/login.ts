import axios from 'axios';

const baseUrl = 'http://localhost:3004/api/login';

const login = async (loginPayload: { username: string; password: string }) => {
  const {
    data: loginData
  }: { data: { username: string; name: string; token: string } } =
    await axios.post(baseUrl, loginPayload);
  const { token } = loginData;
  return token;
};

export default login;
