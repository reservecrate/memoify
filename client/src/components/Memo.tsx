import { Card, Text, Row, Button } from '@nextui-org/react';
import MemoInterface from '../interfaces/Memo';
// import DeleteIcon from '@mui/icons-material/Delete';
import { deleteMemo } from '../services/memos';

interface MemoComponentInterface extends MemoInterface {
  memos: MemoInterface[];
  setMemos: React.Dispatch<React.SetStateAction<MemoInterface[]>>;
  token: string;
}

const Memo = ({
  title,
  content,
  dateCreated,
  user,
  id,
  memos,
  setMemos,
  token
}: MemoComponentInterface) => {
  const { username, name } = user;
  const handleDelete = async () => {
    const { id: deletedMemoId } = await deleteMemo(id, token);
    const memoToDeleteIndex = memos.findIndex(
      memo => memo.id === deletedMemoId
    );
    const memosCopy = JSON.parse(JSON.stringify(memos));
    memosCopy.splice(memoToDeleteIndex, 1);
    setMemos(memosCopy);
  };
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
        <Text>
          created on: {dateCreated} by <b>{username}</b>
        </Text>
        <Button onPressStart={handleDelete} size='xs'>
          delete
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default Memo;
