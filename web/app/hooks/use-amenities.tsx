import { useQuery } from "@tanstack/react-query";
import { getAmenities } from "~/lib/api";

export function useAmenities() {
  return useQuery({
    queryKey: ["amenities"],
    queryFn: async () => getAmenities(),
    staleTime: 10 * 60 * 1000,
  });
}
