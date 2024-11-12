import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputError from "~/components/kit/input-error";
import { Rating } from "~/components/kit/rating";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const schema = z.object({
  content: z.string().min(5).max(2048),
});

type FormInput = z.infer<typeof schema>;

export default function Reviews() {
  const [rating, setRating] = useState(0);
  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">Reviews</h3>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="default">
              <span>Add a review</span>
              <PlusIcon className="size-4 ml-2" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Add a review</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="grid gap-4 py-2">
              <div>
                <Label htmlFor="content">Review</Label>
                <Textarea
                  id="content"
                  rows={10}
                  placeholder="Leave a review"
                  {...form.register("content")}
                />
                <InputError error={form.formState.errors.content} />
              </div>

              <div className="flex flex-row gap-2 items-center">
                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Rating
                </span>
                <Rating
                  id="rating"
                  defaultValue={0}
                  onChange={(v) => setRating(v.value)}
                  disabled={false}
                  starsClassName="size-4"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  alert(
                    JSON.stringify({
                      content: form.getValues("content"),
                      rating,
                    })
                  )
                }
              >
                Create
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        reviews will be here
      </div>
    </div>
  );
}
