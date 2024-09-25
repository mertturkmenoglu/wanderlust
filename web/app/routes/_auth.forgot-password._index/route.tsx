import AuthLink from "~/components/blocks/auth-link";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useForgotPasswordForm, useForgotPasswordMutation } from "./hooks";

export function meta() {
  return [
    { title: "Forgot Password | Wanderlust" },
    {
      name: "description",
      content: "Forgot your password? Reset your Wanderlust account password",
    },
  ];
}

export default function Page() {
  const { formState, register, handleSubmit } = useForgotPasswordForm();
  const mutation = useForgotPasswordMutation();

  return (
    <Card className="container mx-auto my-32 flex max-w-lg flex-col p-8">
      <img
        src="/logo.png"
        alt="Wanderlust"
        className="size-12 min-h-12 min-w-12"
      />
      <h2 className="mt-4 text-xl font-bold">Forgot Password</h2>
      <div className="text-sm text-muted-foreground">
        Already have an account? <AuthLink href="/sign-in" text="Sign In" />
      </div>
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="mt-8 w-full"
      >
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="Email"
          autoComplete="email"
          {...register("email")}
        />
        <InputInfo text="We will send a code to your email address" />
        <InputError error={formState.errors.email} />
        <div className="my-4"></div>

        <Button variant="default" className="w-full" type="submit">
          Send Code
        </Button>
      </form>
    </Card>
  );
}
