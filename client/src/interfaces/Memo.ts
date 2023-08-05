export default interface IMemo {
  title: string;
  content: string;
  dateCreated: number;
  author: {
    username: string;
    name: string;
    id: string;
  };
  id: string;
}

export interface MemoDoc {
  title: string;
  content: string;
  dateCreated: number;
}
