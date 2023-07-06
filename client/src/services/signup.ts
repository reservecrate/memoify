import axios from 'axios';

const baseUrl = 'http://localhost:3004/api/users';

const signup = async (signupPayload: {
  username: string;
  name: string;
  password: string;
}) => {
  const {
    data: userData
  }: { data: { username: string; name: string; passwordHash: string } } =
    await axios.post(baseUrl, signupPayload);
  return userData;
};

export default signup;
