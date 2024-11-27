import RefinementList from "./refinement-list";

export default function Filters() {
  return (
    <>
      <div className="text-lg font-semibold tracking-tight underline">
        Filters
      </div>

      <RefinementList attribute="poi.Category.Name" />

      <RefinementList attribute="poi.Amenities.Amenity.Name" />

      <RefinementList attribute="poi.Poi.PriceLevel" />

      <RefinementList attribute="poi.Poi.AccessibilityLevel" />

      <RefinementList attribute="poi.City.StateName" />

      <RefinementList attribute="poi.City.Name" />

      <RefinementList attribute="poi.City.CountryName" />
    </>
  );
}
