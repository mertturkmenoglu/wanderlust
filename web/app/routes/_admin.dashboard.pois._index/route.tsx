import { useQuery } from "@tanstack/react-query";
import { peekPois } from "~/lib/api";
import { DataTable } from "../../components/blocks/dashboard/data-table";
import { poisCols } from "../../components/blocks/dashboard/columns";

export default function Page() {
  const query = useQuery({
    queryKey: ["pois-peek"],
    queryFn: async () => peekPois(),
  });

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold tracking-tight">
        Point of Interests
      </h3>
      {query.data?.data && (
        <DataTable
          columns={poisCols}
          data={query.data.data.pois.map((poi) => ({
            id: poi.id,
            name: poi.name,
            addressId: poi.addressId,
            categoryId: poi.categoryId,
          }))}
          hrefPrefix="/dashboard/pois"
        />
      )}
    </div>
  );
}
