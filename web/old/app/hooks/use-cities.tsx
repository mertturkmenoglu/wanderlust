import { useQuery } from "@tanstack/react-query";
import { getCities } from "~/lib/api";

export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => getCities(),
    staleTime: 10 * 60 * 1000,
  });
}
