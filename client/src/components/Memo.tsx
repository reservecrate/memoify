import { Card, Text, Row } from '@nextui-org/react';
import MemoProps from '../interfaces/Memo';

const Memo = ({ title, content, dateCreated }: MemoProps) => {
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
      <Card.Footer>
        <Text>created on: {dateCreated}</Text>
      </Card.Footer>
    </Card>
  );
};

export default Memo;
