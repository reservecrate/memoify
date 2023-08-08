import {
  useState,
  useEffect,
  useContext,
  createContext,
  Dispatch,
  SetStateAction
} from 'react';
import Memo from './Memo';
import CreateMemo from './CreateMemo';
import IMemo from '../../interfaces/Memo';
import { AppContext } from '../../App';
import { getMemosByAuthor } from '../../services/memos';
import demoMemosData from '../../data/demoMemos';
import ShadowMemo from './ShadowMemo';
import { useSessionStorage } from 'usehooks-ts';

interface IMemosContext {
  memos: IMemo[];
  setMemos: Dispatch<SetStateAction<IMemo[]>>;
  demoMemos: IMemo[];
  setDemoMemos: Dispatch<SetStateAction<IMemo[]>>;
}

const initialMemosContextData = {
  memos: [],
  setMemos: () => null,
  demoMemos: [],
  setDemoMemos: () => null
};

export const MemosContext = createContext<IMemosContext>(
  initialMemosContextData
);

const Memos = () => {
  const { loggedInUser } = useContext(AppContext);
  const [memos, setMemos] = useState<IMemo[]>([]);
  const [demoMemos, setDemoMemos] = useSessionStorage<IMemo[]>(
    'demoMemos',
    demoMemosData
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const reverseMemos: IMemo[] = loggedInUser.token
    ? JSON.parse(JSON.stringify(memos)).toReversed()
    : JSON.parse(JSON.stringify(demoMemos)).toReversed();

  const hook = () => {
    (async () => {
      if (loggedInUser.token) {
        try {
          const memosData = await getMemosByAuthor(loggedInUser.username);
          setIsLoaded(true);
          setMemos(memosData);
        } catch (err) {
          console.error(err);
        }
      } else {
        setIsLoaded(true);
        setMemos(demoMemos);
      }
    })();
  };

  useEffect(hook, [loggedInUser.token, loggedInUser.username, demoMemos]);

  return (
    <MemosContext.Provider value={{ memos, setMemos, demoMemos, setDemoMemos }}>
      <div className='grid grid-cols-4 grid-rows-3 gap-8 w-full h-full'>
        {isLoaded ? (
          <>
            <CreateMemo />
            {reverseMemos.map(memo => (
              <Memo memo={memo} key={memo.id} />
            ))}
          </>
        ) : (
          <>
            <CreateMemo />
            <ShadowMemo />
            <ShadowMemo />
            <ShadowMemo />
          </>
        )}
      </div>
    </MemosContext.Provider>
  );
};

export default Memos;
