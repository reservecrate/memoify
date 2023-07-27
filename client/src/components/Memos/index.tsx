import { useContext } from 'react';
import Memo from './Memo';
import CreateMemo from './CreateMemo';
import IMemo from '../../interfaces/Memo';
import { AppContext } from '../../App';

const Memos = () => {
  const { memos, loggedInUser, demoMemos } = useContext(AppContext);
  const reverseMemos: IMemo[] = loggedInUser.token
    ? JSON.parse(JSON.stringify(memos)).toReversed()
    : JSON.parse(JSON.stringify(demoMemos)).toReversed();

  return (
    <div className='grid grid-cols-4 gap-8 w-full'>
      <CreateMemo />
      {reverseMemos.map(memo => (
        <Memo memo={memo} key={memo.id} />
      ))}
    </div>
  );
};

export default Memos;
