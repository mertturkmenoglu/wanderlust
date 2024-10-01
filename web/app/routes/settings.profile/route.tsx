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
import { useProfileForm, useProfileMutation } from "./hooks";
import { pronounGroups } from "./pronouns";
import { FormInput } from "./schema";
import UpdateBannerImage from "./update-banner-image";
import UpdateProfileImage from "./update-profile-image";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const Cookie = request.headers.get("Cookie") ?? "";
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
    gender: profile.gender ?? undefined,
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

      <UpdateProfileImage
        fullName={profile.fullName}
        image={profile.profileImage}
      />

      <div className="mt-8">
        <UpdateBannerImage
          fullName={profile.fullName}
          image={profile.bannerImage}
        />
      </div>

      <Separator className="my-4 max-w-xl" />

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 max-w-xl">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          {...form.register("fullName")}
        />
        <InputInfo text="Your full name" />
        <InputError error={form.formState.errors.fullName} />
        <div className="my-4"></div>

        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself"
          autoComplete="off"
          {...form.register("bio")}
        />
        <InputInfo text="Let us know about you" />
        <InputError error={form.formState.errors.bio} />
        <div className="my-4"></div>

        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (000) 000 0000"
          autoComplete="tel"
          {...form.register("phone")}
        />
        <InputInfo text="Your phone number" />
        <InputError error={form.formState.errors.phone} />
        <div className="my-4"></div>

        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://example.com"
          autoComplete="off"
          {...form.register("website")}
        />
        <InputInfo text="Your website address" />
        <InputError error={form.formState.errors.website} />
        <div className="my-4"></div>

        <Label htmlFor="gender">Gender</Label>
        <Input
          id="gender"
          type="text"
          placeholder="Your gender"
          autoComplete="off"
          {...form.register("gender")}
        />
        <InputInfo text="Your gender" />
        <InputError error={form.formState.errors.gender} />
        <div className="my-4"></div>

        <Label htmlFor="pronouns">Pronouns</Label>
        <Controller
          name="pronouns"
          control={form.control}
          render={({ field }) => {
            return (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <InputInfo text="You are free to choose any pronoun." />
        <InputError error={form.formState.errors.pronouns} />
        <div className="my-4"></div>

        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}
