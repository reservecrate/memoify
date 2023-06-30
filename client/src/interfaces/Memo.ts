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
