import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [username, setUsername] = useState("");
  const mutation = useMutation({
    mutationKey: ["user-verify"],
    mutationFn: async () => {
      // TODO: Implement later
    },
    onSuccess: () => {
      toast.success("User is verified");
    },
    onError: (e) => {
      toast.error(`An error happened: ${e.message}`);
    },
  });

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold tracking-tight">
        Make User Verified
      </h3>

      <Input
        type="text"
        value={username}
        className="max-w-[512px]"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <Button
        onClick={() => {
          mutation.mutate();
        }}
        className="mt-4"
      >
        Make User Verified
      </Button>
    </div>
  );
}
