import { Controller } from "react-hook-form";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useAmenities } from "~/hooks/use-amenities";
import { useCategories } from "~/hooks/use-categories";
import { useCities } from "~/hooks/use-cities";
import { useNewPoiForm } from "./hooks";
import OpenTimes from "./open-times";

export default function NewPoiForm() {
  const form = useNewPoiForm();
  const qCategories = useCategories();
  const qCities = useCities();
  const qAmenities = useAmenities();

  if (!qCategories.data || !qCities.data || !qAmenities.data) {
    return <></>;
  }

  const categories = qCategories.data.data.categories;
  const cities = qCities.data.data.cities;
  const amenities = qAmenities.data.data.amenities;

  return (
    <div>
      <form
        className="container mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit(console.log)}
      >
        <div className="">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Name"
            autoComplete="off"
            {...form.register("name")}
          />
          <InputInfo text="Name of the point of interest" />
          <InputError error={form.formState.errors.name} />
        </div>

        <div></div>

        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description of the point of interest"
            rows={4}
            autoComplete="off"
            {...form.register("description")}
          />
          <InputInfo text="Description of the point of interest" />
          <InputError error={form.formState.errors.description} />
        </div>

        <div className="">
          <Label htmlFor="phone">Phone</Label>
          <Input
            type="tel"
            id="phone"
            placeholder="+1 (000) 000 0000"
            autoComplete="tel"
            {...form.register("phone")}
          />
          <InputInfo text="Phone number" />
          <InputError error={form.formState.errors.phone} />
        </div>

        <div className="">
          <Label htmlFor="website">Website</Label>
          <Input
            type="url"
            id="website"
            placeholder="https://example.com"
            autoComplete="off"
            {...form.register("website")}
          />
          <InputInfo text="Website address" />
          <InputError error={form.formState.errors.website} />
        </div>

        <div className="">
          <Label htmlFor="accessibility-level">Accessibility Level</Label>
          <Controller
            name="accessibilityLevel"
            control={form.control}
            render={({ field }) => {
              return (
                <Select onValueChange={(str) => field.onChange(+str)}>
                  <SelectTrigger id="accessibility-level">
                    <SelectValue placeholder="Accessibility Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          <InputInfo text="Choose an accessibility level" />
          <InputError error={form.formState.errors.accessibilityLevel} />
        </div>

        <div className="">
          <Label htmlFor="price-level">Price Level</Label>
          <Controller
            name="priceLevel"
            control={form.control}
            render={({ field }) => {
              return (
                <Select onValueChange={(str) => field.onChange(+str)}>
                  <SelectTrigger id="price-level">
                    <SelectValue placeholder="Price Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          <InputInfo text="Choose a price level" />
          <InputError error={form.formState.errors.priceLevel} />
        </div>

        <div className="">
          <Label htmlFor="category">Category</Label>
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field }) => {
              return (
                <Select onValueChange={(str) => field.onChange(+str)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          <InputInfo text="Choose a category" />
          <InputError error={form.formState.errors.categoryId} />
        </div>

        <div></div>

        <div className="col-span-2">
          <h3 className="my-4 text-lg font-bold tracking-tight">Address</h3>
        </div>

        <div className="">
          <Label htmlFor="city">City</Label>
          <Controller
            name="address.cityId"
            control={form.control}
            render={({ field }) => {
              return (
                <Select onValueChange={(str) => field.onChange(+str)}>
                  <SelectTrigger id="city">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}, {city.stateName}, {city.countryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          <InputInfo text="Choose a city" />
          <InputError error={form.formState.errors.address?.cityId} />
        </div>

        <div className="">
          <Label htmlFor="postal-code">Postal Code</Label>
          <Input
            type="text"
            id="postal-code"
            placeholder="Postal Code"
            autoComplete="postal-code"
            {...form.register("address.postalCode")}
          />
          <InputInfo text="Postal code" />
          <InputError error={form.formState.errors.address?.postalCode} />
        </div>

        <div className="">
          <Label htmlFor="line1">Line 1</Label>
          <Input
            type="text"
            id="line1"
            placeholder="Address line 1"
            autoComplete="address-line1"
            {...form.register("address.line1")}
          />
          <InputInfo text="Address line 1" />
          <InputError error={form.formState.errors.address?.line1} />
        </div>

        <div className="">
          <Label htmlFor="line2">Line 2</Label>
          <Input
            type="text"
            id="line2"
            placeholder="Address line 2"
            autoComplete="address-line2"
            {...form.register("address.line2")}
          />
          <InputInfo text="Address line 2" />
          <InputError error={form.formState.errors.address?.line2} />
        </div>

        <div className="">
          <Label htmlFor="lat">Latitude</Label>
          <Input
            type="number"
            id="lat"
            placeholder="Latitude"
            autoComplete="off"
            {...form.register("address.lat", { valueAsNumber: true })}
          />
          <InputInfo text="Latitude" />
          <InputError error={form.formState.errors.address?.lat} />
        </div>

        <div className="">
          <Label htmlFor="lng">Longitude</Label>
          <Input
            type="number"
            id="lng"
            placeholder="Longitude"
            autoComplete="off"
            {...form.register("address.lng", { valueAsNumber: true })}
          />
          <InputInfo text="Longitude" />
          <InputError error={form.formState.errors.address?.lng} />
        </div>

        <div className="col-span-2">
          <h3 className="my-4 text-lg font-bold tracking-tight">Amenities</h3>
        </div>

        <div className="col-span-2">
          <Label htmlFor="amenities">Amenities</Label>
          <Controller
            name="amenities"
            control={form.control}
            render={() => {
              return (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-2">
                  {amenities.map((amenity) => (
                    <Controller
                      key={amenity.id}
                      control={form.control}
                      name="amenities"
                      render={({ field }) => {
                        return (
                          <div className="flex items-center gap-1">
                            <Checkbox
                              checked={field.value?.includes(amenity.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value ?? []),
                                      amenity.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== amenity.id
                                      )
                                    );
                              }}
                            />

                            <Label className="font-normal">
                              {amenity.name}
                            </Label>
                          </div>
                        );
                      }}
                    />
                  ))}
                </div>
              );
            }}
          />
          <InputError error={form.formState.errors.amenities?.root} />
        </div>

        {/* open times */}
        <div className="col-span-2">
          <h3 className="my-4 text-lg font-bold tracking-tight">Open Times</h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <OpenTimes day="mon" form={form} />
            <OpenTimes day="tue" form={form} />
            <OpenTimes day="wed" form={form} />
            <OpenTimes day="thu" form={form} />
            <OpenTimes day="fri" form={form} />
            <OpenTimes day="sat" form={form} />
            <OpenTimes day="sun" form={form} />
          </div>
        </div>

        {/* media */}

        <div>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
}
