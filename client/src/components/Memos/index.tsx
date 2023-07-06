import Memo from './Memo';
import CreateMemo from './CreateMemo';
import { Grid } from '@nextui-org/react';
import MemoInterface from '../../interfaces/Memo';

const Memos = ({
  memos,
  setMemos,
  token
}: {
  memos: MemoInterface[];
  setMemos: React.Dispatch<React.SetStateAction<MemoInterface[]>>;
  token: string;
}) => {
  const reverseMemos: MemoInterface[] = JSON.parse(
    JSON.stringify(memos)
  ).toReversed();
  console.log(reverseMemos);
  return (
    <Grid.Container gap={1}>
      <Grid xs={3}>
        <CreateMemo memos={memos} setMemos={setMemos} token={token} />
      </Grid>
      {reverseMemos.map(memo => {
        const { title, content, dateCreated, user, id } = memo;
        return (
          <Grid xs={3} key={id}>
            <Memo
              title={title}
              content={content}
              dateCreated={dateCreated}
              user={user}
              id={id}
              memos={memos}
              setMemos={setMemos}
              token={token}
            />
          </Grid>
        );
      })}
    </Grid.Container>
  );
};

export default Memos;
