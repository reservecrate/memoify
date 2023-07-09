import { FormElement } from '@nextui-org/react';

export default interface IMemo {
  title: string;
  content: string;
  dateCreated: number;
  user: {
    username: string;
    name: string;
    id: string;
  };
  id: string;
}
