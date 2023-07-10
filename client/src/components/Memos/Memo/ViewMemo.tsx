import { useContext } from 'react';
import { Card, Text, Row, Tooltip, Button, Spacer } from '@nextui-org/react';
import IMemo from '../../../interfaces/Memo';
import { MemoContext } from '.';
import dateFormatter from '../../../utils/dateFormatter';

const ViewMemo = ({ title, content, dateCreated, author }: IMemo) => {
  const { handleEdit, handleDelete } = useContext(MemoContext);
  const { username } = author;
  const { formattedDate, formattedTime } = dateFormatter(dateCreated);

  return (
    <Card variant='bordered' isPressable isHoverable>
      <Card.Header>
        <Row justify='center'>
          <Text h4>{title}</Text>
        </Row>
      </Card.Header>
      <Card.Divider />
      <Card.Body>
        <Text>{content}</Text>
      </Card.Body>
      <Card.Divider />
      <Card.Footer
        css={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Text
          css={{
            textGradient: '45deg, $blue600 -20%, $red600 100%'
          }}
        >
          created on {formattedDate} at {formattedTime} by <b>{username}</b>
        </Text>
        <Spacer y={0.5} />
        <Row justify='space-evenly'>
          <Tooltip
            content='edit memo OwO'
            contentColor='secondary'
            color='default'
            css={{}}
          >
            <Button size='sm' color='gradient' shadow onPressStart={handleEdit}>
              edit
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
export default ViewMemo;
