import { useContext, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
  useDisclosure,
  Tooltip
} from '@nextui-org/react';
import IMemo from '../../../interfaces/Memo';
import { MemoContext } from '.';
import dateFormatter from '../../../utils/dateFormatter';
import MemoModal from '../../MemoModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MdEdit, MdDelete } from 'react-icons/md';

const ViewMemo = ({ memo, gradient }: { memo: IMemo; gradient: string }) => {
  const { title, content, dateCreated, author } = memo;
  const { toggleEdit, handleDelete } = useContext(MemoContext);
  const { formattedDate, formattedTime } = dateFormatter(dateCreated);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editVariant, setEditVariant] = useState('flat');
  const [deleteVariant, setDeleteVariant] = useState('flat');

  return (
    <>
      <Card
        isPressable
        isHoverable
        onPressStart={onOpen}
        className='col-span-1 row-span-1'
      >
        <CardHeader className='flex justify-center py-0'>
          <h2
            className='text-3xl font-extrabold line-clamp-2 py-1'
            // style={{
            //   background: gradient,
            //   backgroundClip: 'text',
            //   WebkitTextFillColor: 'transparent'
            // }}
          >
            {title}
          </h2>
        </CardHeader>
        <Divider />
        <CardBody className='p-2'>
          <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            className='whitespace-pre-wrap w-full h-full flex flex-col'
          />
        </CardBody>
        <Divider />
        <CardFooter className='flex flex-col items-center shrink-0 pt-0'>
          <p
            style={{
              background: gradient,
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            className='h-1/2'
          >
            created on {formattedDate} at {formattedTime} by{' '}
            <strong className='font-extrabold'>{author.username}</strong>
          </p>
          <div className='flex flex-row justify-evenly items-center w-full h-1/2'>
            <Tooltip
              content='edit memo'
              showArrow
              color='primary'
              delay={0}
              closeDelay={0}
            >
              <Button
                onPressStart={toggleEdit}
                color='primary'
                variant={editVariant}
                className='w-1/3'
                endContent={<MdEdit />}
                onMouseEnter={() => setEditVariant('solid')}
                onMouseLeave={() => setEditVariant('flat')}
              >
                edit
              </Button>
            </Tooltip>
            <Tooltip
              content='delete memo'
              showArrow
              color='danger'
              delay={0}
              closeDelay={0}
            >
              <Button
                onPressStart={handleDelete}
                color='danger'
                variant={deleteVariant}
                className='w-1/3'
                endContent={<MdDelete />}
                onMouseEnter={() => setDeleteVariant('solid')}
                onMouseLeave={() => setDeleteVariant('flat')}
              >
                delete
              </Button>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
      <MemoModal isOpen={isOpen} onClose={onClose} memo={memo} />
    </>
  );
};
export default ViewMemo;
