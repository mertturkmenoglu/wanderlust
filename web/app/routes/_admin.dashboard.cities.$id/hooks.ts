import { useNavigate } from "@remix-run/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCity } from "~/lib/api";

export function useDeleteCityMutation(id: number) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["city-delete"],
    mutationFn: async () => deleteCity(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cities"] });
      navigate("/dashboard/cities");
      toast.success("City deleted");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
