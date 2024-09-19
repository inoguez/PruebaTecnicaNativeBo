import React from 'react';
import { Skeleton } from './ui/skeleton';

export default function SkeletonCard() {
  return (
    <div className='grid gap-4 '>
      <Skeleton className='w-full h-4 rounded-full' />
      <Skeleton className='w-full h-32 aspect-square ' />
      <Skeleton className='w-full h-2 rounded-full' />
      <Skeleton className='w-full h-2 rounded-full' />
      <Skeleton className='w-full h-2 rounded-full' />
      <Skeleton className='w-full h-2 rounded-full' />
    </div>
  );
}
