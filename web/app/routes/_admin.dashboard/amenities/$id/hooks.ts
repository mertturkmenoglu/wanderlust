import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteAmenity } from "~/lib/api";

export function useDeleteAmenityMutation(id: number) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["amenity-delete"],
    mutationFn: async () => deleteAmenity(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["amenities"] });
      toast.success("Amenity deleted");
      navigate("/dashboard/amenities");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
