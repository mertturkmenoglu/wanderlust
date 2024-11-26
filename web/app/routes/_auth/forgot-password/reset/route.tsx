import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import AuthLink from "~/components/blocks/auth/link";
import InputError from "~/components/kit/input-error";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { Route } from "./+types/route";
import { usePasswordResetForm, usePasswordResetMutation } from "./hooks";

export function meta(): Route.MetaDescriptors {
  return [
    { title: "Reset Password | Wanderlust" },
    {
      name: "description",
      content: "Reset your Wanderlust account password",
    },
  ];
}

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const { formState, register, handleSubmit } = usePasswordResetForm();
  const mutation = usePasswordResetMutation();

  return (
    <Card className="mx-auto my-32 flex max-w-md flex-col p-8">
      <img
        src="/logo.png"
        alt="Wanderlust"
        className="size-12 min-h-12 min-w-12"
      />
      <h2 className="mt-4 text-xl font-bold">Reset Password</h2>
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
          disabled={true}
          {...register("email")}
        />
        <InputError error={formState.errors.email} />
        <div className="my-4"></div>

        <Label htmlFor="code">Code</Label>
        <Input
          type="text"
          id="code"
          placeholder="Code"
          autoComplete="off"
          {...register("code")}
        />
        <InputError error={formState.errors.code} />
        <div className="my-4"></div>

        <Label htmlFor="new-password">New Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="New Password"
            autoComplete="new-password"
            className="pr-10"
            {...register("newPassword")}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={() => setShowPassword((prev) => !prev)}
            type="button"
          >
            {showPassword ? (
              <EyeIcon className="size-4" />
            ) : (
              <EyeOffIcon className="size-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center">
          <InputError
            error={formState.errors.newPassword}
            className="self-start"
          />
          <div className="my-4"></div>
        </div>

        <Button variant="default" className="w-full" type="submit">
          Reset Your Password
        </Button>
      </form>
    </Card>
  );
}
