import CategoryNavigation from '@/components/blocks/CategoryNavigation';
import NewLocations from './_components/new-locations';
import Search from './_components/search';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  return (
    <main className="">
      <Search />

      <CategoryNavigation />

      <NewLocations />
    </main>
  );
}
