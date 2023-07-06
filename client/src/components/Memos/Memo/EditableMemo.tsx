import {
  Card,
  Text,
  Row,
  Tooltip,
  Button,
  Input,
  Textarea
} from '@nextui-org/react';
import { EditableMemoComponentInterface } from '../../../interfaces/Memo';

const EditableMemo = ({
  title,
  content,
  dateCreated,
  user,
  handleUpdate,
  handleDelete,
  handleInputChange
}: EditableMemoComponentInterface) => {
  const { username } = user;

  return (
    <Card variant='bordered' isHoverable>
      <Card.Header>
        <Row justify='center'>
          <Input
            aria-label='InputUpdateTitle'
            id='InputUpdateTitle'
            value={title}
            onChange={handleInputChange}
          />
        </Row>
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
