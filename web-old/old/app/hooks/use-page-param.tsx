import { useSearchParams } from "react-router";

export function usePageParam(name: string | undefined = "page"): number {
  const [sp] = useSearchParams();
  const str = sp.get(name) ?? "1";
  const int = parseInt(str);
  return isNaN(int) ? 1 : int;
}
