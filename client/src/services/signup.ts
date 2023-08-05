import axios from 'axios';

// const baseUrl = 'http://localhost:3004/api/users';
const baseUrl = '/api/users';

const signup = async (signupPayload: {
  username: string;
  name: string;
  password: string;
}) => {
  const { data: createdUser }: { data: { username: string; name: string } } =
    await axios.post(baseUrl, signupPayload);
  const { username, name } = createdUser;
  return { username, name };
};

export default signup;
