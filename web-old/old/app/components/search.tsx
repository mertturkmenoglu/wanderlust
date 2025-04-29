import { InstantSearch } from "react-instantsearch";
import { useNavigate } from "react-router";
import { Autocomplete } from "~/components/blocks/autocomplete";
import { useSearchClient } from "~/hooks/use-search-client";
import { cn } from "~/lib/utils";

type Props = {
  className?: string;
  onItemClicked?: () => void;
  showAdvancedSearch?: boolean;
};

export default function Search({
  className,
  onItemClicked,
  showAdvancedSearch = true,
}: Props) {
  const searchClient = useSearchClient();
  const navigate = useNavigate();

  return (
    <nav
      className={cn(
        "mx-auto my-12 flex items-center justify-center space-x-4 w-full",
        className
      )}
    >
      <InstantSearch
        indexName="pois"
        searchClient={searchClient}
        routing={false}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Autocomplete
          showAdvancedSearch={showAdvancedSearch}
          isCardClickable={true}
          onCardClick={(v) => {
            navigate(`/p/${v.id}`);
            if (onItemClicked !== undefined) {
              onItemClicked();
            }
          }}
        />
      </InstantSearch>
    </nav>
  );
}
