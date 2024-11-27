import CustomSearchBox from "~/components/blocks/custom-search-box";
import Filters from "./filters";
import Results from "./results";

export default function Container() {
  return (
    <>
      <CustomSearchBox isSearchOnType={true} />

      <div className="my-8 flex gap-8">
        <div className="min-w-[256px]">
          <Filters />
        </div>

        <div className="w-full">
          <Results />
        </div>
      </div>
    </>
  );
}
