import { useParams } from "@tanstack/react-router";

export function usePageParam(name: string | undefined = "page"): number {
  const [sp] = useParams();
  const str = sp.get(name) ?? "1";
  const int = parseInt(str);
  return isNaN(int) ? 1 : int;
}
