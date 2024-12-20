import { useLoaderData, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { publishDraft } from "~/lib/api";
import { loader } from "../../route";

export default function Page() {
  const { draft } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["publish-draft", draft.id],
    mutationFn: async () => publishDraft(draft.id),
    onSuccess: () => {
      navigate(`/dashboard/pois/drafts`);
      toast.success("Draft published");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div>
      <h3 className="mt-8 text-lg font-bold tracking-tight">
        Review & Publish
      </h3>
      <div className="mt-2 text-sm text-muted-foreground">
        Review and publish your draft.
      </div>

      <Button onClick={() => mutation.mutate()} className="my-8">
        Publish
      </Button>

      <Textarea
        rows={50}
        placeholder="Draft data"
        className="mt-4 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        value={JSON.stringify(draft, null, 2)}
        readOnly
      />
    </div>
  );
}
