import { LogOutIcon } from "lucide-react";
import { useCallback } from "react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import api from "~/lib/api";

export default function Logout(): React.ReactElement {
  const logout = async () => {
    await api.post("auth/logout");
    window.location.reload();
  };

  const onClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    await logout();
  }, []);

  return (
    <DropdownMenuItem
      className="cursor-pointer group focus:bg-destructive"
      onClick={onClick}
    >
      <LogOutIcon className="size-4 group-focus:text-white" />
      <span className="ml-2 group-focus:text-white">Log out</span>
    </DropdownMenuItem>
  );
}
