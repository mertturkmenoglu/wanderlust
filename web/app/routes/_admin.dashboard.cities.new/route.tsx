import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import BackLink from "~/components/blocks/back-link";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { ipx } from "~/lib/img-proxy";
import { useNewCityForm, useNewCityMutation } from "./hooks";
import { FormInput } from "./schema";

export default function Page() {
  const [previewUrl, setPreviewUrl] = useState("");
  const form = useNewCityForm();
  const mutation = useNewCityMutation();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <BackLink href="/dashboard/cities" text="Go back to cities page" />
      <h3 className="mb-8 text-lg font-bold tracking-tight">Create New City</h3>

      {previewUrl !== "" && (
        <img
          src={ipx(previewUrl, "w_512")}
          alt="Preview"
          className="mt-8 w-64 rounded-md aspect-video object-cover"
        />
      )}

      <form
        className="container mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="">
          <Label htmlFor="id">ID</Label>
          <Input
            type="number"
            id="id"
            placeholder="ID"
            autoComplete="off"
            {...form.register("id", { valueAsNumber: true })}
          />
          <InputInfo text="ID of the city" />
          <InputError error={form.formState.errors.id} />
        </div>

        <div className="">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Name"
            autoComplete="off"
            {...form.register("name")}
          />
          <InputInfo text="Name of the city" />
          <InputError error={form.formState.errors.name} />
        </div>

        <div className="">
          <Label htmlFor="state-code">State Code</Label>
          <Input
            type="text"
            id="state-code"
            placeholder="State Code"
            autoComplete="off"
            {...form.register("stateCode")}
          />
          <InputInfo text="State Code" />
          <InputError error={form.formState.errors.stateCode} />
        </div>

        <div className="">
          <Label htmlFor="state-name">State Name</Label>
          <Input
            type="text"
            id="state-name"
            placeholder="State Name"
            autoComplete="off"
            {...form.register("stateName")}
          />
          <InputInfo text="State Name" />
          <InputError error={form.formState.errors.stateName} />
        </div>

        <div className="">
          <Label htmlFor="country-code">Country Code</Label>
          <Input
            type="text"
            id="country-code"
            placeholder="Country Code"
            autoComplete="off"
            {...form.register("countryCode")}
          />
          <InputInfo text="Country Code" />
          <InputError error={form.formState.errors.countryCode} />
        </div>

        <div className="">
          <Label htmlFor="country-name">Country Name</Label>
          <Input
            type="text"
            id="country-name"
            placeholder="Country Name"
            autoComplete="off"
            {...form.register("countryName")}
          />
          <InputInfo text="Country Name" />
          <InputError error={form.formState.errors.countryName} />
        </div>

        <div className="">
          <Label htmlFor="image">Image URL</Label>
          <Input
            type="url"
            id="image"
            placeholder="https://example.com/image.jpg"
            autoComplete="off"
            {...form.register("imageUrl")}
          />
          <InputInfo text={(form.watch("imageUrl")?.length ?? 0) + "/255"} />
          <InputError error={form.formState.errors.imageUrl} />
          <Button
            type="button"
            variant="link"
            className="px-0"
            onClick={() => setPreviewUrl(form.watch("imageUrl"))}
          >
            Preview
          </Button>
        </div>

        <div></div>

        <div className="">
          <Label htmlFor="lat">Latitude</Label>
          <Input
            type="number"
            id="lat"
            step="any"
            placeholder="Latitude"
            autoComplete="off"
            {...form.register("latitude", { valueAsNumber: true })}
          />
          <InputInfo text="Latitude" />
          <InputError error={form.formState.errors.latitude} />
        </div>

        <div className="">
          <Label htmlFor="lng">Longitude</Label>
          <Input
            type="number"
            id="lng"
            step="any"
            placeholder="Longitude"
            autoComplete="off"
            {...form.register("longitude", { valueAsNumber: true })}
          />
          <InputInfo text="Longitude" />
          <InputError error={form.formState.errors.longitude} />
        </div>

        <div className="col-span-2">
          <Button
            type="button"
            variant="link"
            className="px-0"
            onClick={async () => {
              const text = await navigator.clipboard.readText();
              const [lat, lng] = text.split(", ").map((s) => parseFloat(s));
              if (isNaN(lat) || isNaN(lng)) {
                toast.error("Invalid GeoHack format");
                return;
              }

              form.setValue("latitude", lat);
              form.setValue("longitude", lng);
            }}
          >
            Paste from clipboard as GeoHack format
          </Button>
        </div>

        <div className="col-span-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            placeholder="Description of the city"
            autoComplete="off"
            rows={6}
            {...form.register("description")}
          />
          <InputInfo
            text={(form.watch("description")?.length ?? 0) + "/1024"}
          />
          <InputError error={form.formState.errors.description} />
        </div>

        <div>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
}
