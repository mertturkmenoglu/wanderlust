import { SearchIcon } from "lucide-react";
import { useRef, useState } from "react";
import { UseSearchBoxProps, useSearchBox } from "react-instantsearch";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type Props = {
  isSearchOnType?: boolean;
} & UseSearchBoxProps;

export default function CustomSearchBox({
  isSearchOnType = false,
  ...props
}: Props) {
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  function setQuery(newQuery: string) {
    setInputValue(newQuery);
    if (isSearchOnType) {
      refine(newQuery);
    }
  }

  return (
    <div>
      <form
        action=""
        role="search"
        className="flex gap-2"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (inputRef.current) {
            inputRef.current.blur();
          }

          if (!isSearchOnType) {
            refine(inputValue);
          }
        }}
        onReset={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setQuery("");

          if (inputRef.current) {
            inputRef.current.focus();
          }

          if (!isSearchOnType) {
            refine("");
          }
        }}
      >
        <Input
          ref={inputRef}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="rounded-full"
          placeholder="Search a location"
          spellCheck={false}
          maxLength={128}
          type="search"
          value={inputValue}
          onChange={(e) => {
            setQuery(e.currentTarget.value);
          }}
          autoFocus
        />

        <Button type="submit" className="rounded-full" size="icon">
          <span className="sr-only">Search</span>
          <SearchIcon className="size-4" />
        </Button>
      </form>
    </div>
  );
}
