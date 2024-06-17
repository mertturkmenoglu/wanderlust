import TagNavigation from '@/components/blocks/TagNavigation';
import DiscoverAroundYou from './_components/discover-around-you';
import NewLocations from './_components/new-locations';
import Search from './_components/search';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  return (
    <div className="container">
      <Search />

      <TagNavigation />

      <NewLocations />

      <DiscoverAroundYou />
    </div>
  );
}
