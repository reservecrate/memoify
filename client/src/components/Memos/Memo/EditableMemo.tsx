import { useContext } from 'react';
import {
  Card,
  Text,
  Tooltip,
  Button,
  Input,
  Textarea
} from '@nextui-org/react';
import IMemo from '../../../interfaces/Memo';
import { MemoContext } from '.';

const EditableMemo = ({ title, content, dateCreated, author, id }: IMemo) => {
  const { handleInputChange, handleDelete, handleUpdate } =
    useContext(MemoContext);
  const { username } = author;

  return (
    <Card variant='bordered' isHoverable>
      <Card.Header>
        <Input
          aria-label='InputUpdateTitle'
          id='InputUpdateTitle'
          value={title}
          onChange={handleInputChange}
          css={{ width: '100%' }}
          clearable
        />
      </Card.Header>
      <Card.Divider />
      <Card.Body>
        <Textarea
          aria-label='TextareaUpdateContent'
          id='TextareaUpdateContent'
          value={content}
          onChange={handleInputChange}
        />
        <Button size='sm' color='gradient' shadow onPressStart={handleUpdate}>
          save
        </Button>
      </Card.Body>
      <Card.Divider />
      <Card.Footer>
        <Text>
          created on: {dateCreated} by <b>{username}</b>
        </Text>
        <Tooltip content='delete this memo' contentColor='warning'>
          <Button onPressStart={handleDelete} size='xs' shadow color='error'>
            <Text>delete</Text>
          </Button>
        </Tooltip>
      </Card.Footer>
    </Card>
  );
};

export default EditableMemo;
