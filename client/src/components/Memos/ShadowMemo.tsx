import { Card, Skeleton } from '@nextui-org/react';

const ShadowMemo = () => {
  return (
    <Card className='space-y-5 p-4 col-span-1 row-span-1'>
      <Skeleton className='rounded-2xl h-1/4 w-3/4'>
        <div />
      </Skeleton>
      <Skeleton className='rounded-xl h-1/2'>
        <div />
      </Skeleton>
      <div className='h-1/4 space-y-3 py-2'>
        <Skeleton className='rounded-full h-1/2 w-4/5'>
          <div />
        </Skeleton>
        <Skeleton className='rounded-full h-1/2 w-3/5'>
          <div />
        </Skeleton>
      </div>
    </Card>
  );
};

export default ShadowMemo;
