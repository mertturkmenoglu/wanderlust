import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useVerifyUserMutation } from "./hooks";

export default function Page() {
  const [username, setUsername] = useState("");
  const mutation = useVerifyUserMutation();

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
          mutation.mutate(username);
        }}
        className="mt-4"
      >
        Make User Verified
      </Button>
    </div>
  );
}
