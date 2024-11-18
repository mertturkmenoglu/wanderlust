import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Controller, SubmitHandler } from "react-hook-form";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { getMe, getUserByUsername } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import { useProfileForm, useProfileMutation } from "./hooks";
import { pronounGroups } from "./pronouns";
import { FormInput } from "./schema";
import UpdateImage from "./update-image";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const Cookie = getCookiesFromRequest(request);
    const auth = await getMe({ headers: { Cookie } });

    if (!auth.data) {
      throw redirect("/");
    }

    const profile = await getUserByUsername(auth.data.username);

    return json({ auth: auth.data, profile: profile.data });
  } catch (e) {
    throw redirect("/");
  }
}

export default function Page() {
  const { profile } = useLoaderData<typeof loader>();
  const form = useProfileForm({
    fullName: profile.fullName ?? undefined,
    bio: profile.bio ?? undefined,
    pronouns: profile.pronouns ?? undefined,
    website: profile.website ?? undefined,
    phone: profile.phone ?? undefined,
  });
  const mutation = useProfileMutation();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight first:mt-0">
        Profile
      </h2>

      <div className="grid grid-cols-3 gap-4 mt-4 items-center">
        <Label>Profile Image</Label>
        <div className="col-span-2 flex">
          <UpdateImage
            fullName={profile.fullName}
            image={profile.profileImage}
            fallbackImage="/profile.png"
            action="profile"
          />
        </div>

        <Label>Banner Image</Label>
        <div className="col-span-2 flex">
          <UpdateImage
            fullName={profile.fullName}
            image={profile.bannerImage}
            fallbackImage="https://i.imgur.com/EwvUEmR.jpg"
            action="banner"
          />
        </div>
      </div>

      <Separator className="my-4" />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 grid grid-cols-3 gap-4 md:gap-8"
      >
        <Label htmlFor="name" className="mt-2">
          Full Name
        </Label>
        <div className="col-span-2">
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            {...form.register("fullName")}
          />
          <InputError error={form.formState.errors.fullName} />
        </div>

        <Label htmlFor="bio" className="mt-2">
          Bio
        </Label>
        <div className="col-span-2">
          <Textarea
            id="bio"
            placeholder="Tell us about yourself"
            autoComplete="off"
            rows={6}
            {...form.register("bio")}
          />
          <InputInfo text="Let us know about you" />
          <InputError error={form.formState.errors.bio} />
        </div>

        <Label htmlFor="phone" className="mt-2">
          Phone
        </Label>
        <div className="col-span-2">
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (000) 000 0000"
            autoComplete="tel"
            {...form.register("phone")}
          />
          <InputError error={form.formState.errors.phone} />
        </div>

        <Label htmlFor="website" className="mt-2">
          Website
        </Label>
        <div className="col-span-2">
          <Input
            id="website"
            type="url"
            placeholder="https://example.com"
            autoComplete="off"
            {...form.register("website")}
          />
          <InputError error={form.formState.errors.website} />
        </div>

        <Label htmlFor="pronouns" className="mt-2">
          Pronouns
        </Label>
        <div className="col-span-2">
          <Controller
            name="pronouns"
            control={form.control}
            render={({ field }) => {
              return (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pronoun" />
                  </SelectTrigger>
                  <SelectContent>
                    {pronounGroups.map((pgroup) => (
                      <SelectGroup key={pgroup.label}>
                        <SelectLabel>{pgroup.label}</SelectLabel>
                        {pgroup.options.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          <InputError error={form.formState.errors.pronouns} />
        </div>

        <div className="col-span-2"></div>

        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}
