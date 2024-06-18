import { Hits } from 'react-instantsearch';
import Hit from './hit';
import HitsPerPage from './hits-per-page';
import Pagination from './pagination';

export default function Results() {
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="text-2xl font-semibold tracking-tight">Results</div>
        <HitsPerPage />
      </div>
      <hr className="my-2" />
      <Hits hitComponent={Hit} />
      <Pagination />
    </>
  );
}
