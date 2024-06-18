'use client';

import AppMessage from '@/components/blocks/AppMessage';
import CustomSearchBox from '@/components/blocks/CustomSearchBox';
import { useEmptyResult } from '../_hooks/use-empty-result';
import Filters from './filters';
import Results from './results';

export default function Container() {
  const { isEmptyResult, isEmptyQuery } = useEmptyResult();
  const show = !(isEmptyResult || isEmptyQuery);

  return (
    <>
      <CustomSearchBox />

      {isEmptyQuery && (
        <AppMessage
          emptyMessage="Start typing to search."
          showBackButton={false}
          className="my-16"
        />
      )}

      {isEmptyResult && (
        <AppMessage
          emptyMessage="No results found."
          showBackButton={false}
          className="my-16"
        />
      )}

      {show && (
        <div className="my-8 flex gap-8">
          <div className="min-w-[256px]">
            <Filters />
          </div>

          <div className="w-full">
            <Results />
          </div>
        </div>
      )}
    </>
  );
}
