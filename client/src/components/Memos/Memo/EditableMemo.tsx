import { useContext } from 'react';
import {
  Card,
  Text,
  Tooltip,
  Button,
  Input,
  Textarea,
  Row,
  Spacer
} from '@nextui-org/react';
import IMemo from '../../../interfaces/Memo';
import { MemoContext } from '.';
import dateFormatter from '../../../utils/dateFormatter';

const EditableMemo = ({ title, content, dateCreated, author }: IMemo) => {
  const { handleInputChange, handleDelete, handleUpdate } =
    useContext(MemoContext);
  const { username } = author;
  const { formattedDate, formattedTime } = dateFormatter(dateCreated);

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
      </Card.Body>
      <Card.Divider />
      <Card.Footer
        css={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Text>
          created on {formattedDate} at {formattedTime} by <b>{username}</b>
        </Text>
        <Spacer y={0.25} />
        <Row justify='space-evenly'>
          <Tooltip
            content='save your changes UwU'
            contentColor='secondary'
            color='default'
            css={{}}
          >
            <Button
              size='sm'
              color='gradient'
              shadow
              onPressStart={handleUpdate}
            >
              save
            </Button>
          </Tooltip>

          <Tooltip
            content='delete memo ÒwÓ'
            contentColor='warning'
            color='default'
            css={{}}
          >
            <Button onPressStart={handleDelete} size='sm' shadow color='error'>
              <Text>delete</Text>
            </Button>
          </Tooltip>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default EditableMemo;
