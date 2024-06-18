'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { UseSearchBoxProps, useSearchBox } from 'react-instantsearch';

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
        className="flex gap-8"
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

          setQuery('');

          if (inputRef.current) {
            inputRef.current.focus();
          }

          if (!isSearchOnType) {
            refine('');
          }
        }}
      >
        <Input
          ref={inputRef}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Search a location"
          spellCheck={false}
          maxLength={512}
          type="search"
          value={inputValue}
          onChange={(e) => {
            setQuery(e.currentTarget.value);
          }}
          autoFocus
        />

        <Button type="submit">
          Search
          <SearchIcon className="ml-2 size-4" />
        </Button>
      </form>
    </div>
  );
}
