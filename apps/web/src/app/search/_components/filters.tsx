'use client';

import { useCategories } from '@/hooks/use-categories';
import RefinementList from './refinement-list';

export default function Filters() {
  const query = useCategories();

  return (
    <>
      <div className="text-lg font-semibold tracking-tight underline">
        Filters
      </div>

      <RefinementList attribute="tags" />

      <RefinementList attribute="address.city" />

      <RefinementList attribute="address.state" />

      {query.data && (
        <RefinementList
          attribute="categoryId"
          categories={query.data.data}
        />
      )}

      <RefinementList attribute="priceLevel" />

      <RefinementList
        attribute="accessibilityLevel"
        className="mt-4"
      />
    </>
  );
}
