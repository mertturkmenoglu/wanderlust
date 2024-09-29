import { useLoaderData } from "@remix-run/react";
import { loader } from "../../route";

export default function Step2() {
  const { draft } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="mt-8 text-lg font-bold tracking-tight">Step 2</h3>
      <pre className="mt-8">{JSON.stringify(draft, null, 2)}</pre>
    </div>
  );
}
