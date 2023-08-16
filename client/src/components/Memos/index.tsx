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
import ShadowCreateMemo from '../Shadows/ShadowCreateMemo';
import ShadowMemo from '../Shadows/ShadowMemo';
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
      <div className='col-span-7 grid grid-cols-4 grid-rows-3 gap-6 h-screen w-full'>
        {isLoaded ? (
          <>
            <CreateMemo />
            {reverseMemos.map(memo => (
              <Memo memo={memo} key={memo.id} />
            ))}
          </>
        ) : (
          <>
            <ShadowCreateMemo />
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
