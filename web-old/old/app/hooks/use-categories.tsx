import { useQuery } from "@tanstack/react-query";
import { getCategories } from "~/lib/api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => getCategories(),
    staleTime: 10 * 60 * 1000,
  });
}
