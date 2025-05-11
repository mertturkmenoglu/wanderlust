import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowDownIcon, ArrowUpIcon, XIcon } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { type FormInput } from '../../-schema';
import SearchInput from './search-input';
import SearchResults from './search-results';
import UserCard from './user-card';

export default function Step3() {
  const form = useFormContext<FormInput>();
  const { fields, swap, append, remove } = useFieldArray({
    control: form.control,
    name: 'friends',
  });

  return (
    <div className="w-full mt-4">
      <Label>
        Have you had any friends with you? Let's add them to your diary.
      </Label>

      <div className="max-w-xl mx-auto group mt-2">
        <SearchInput />

        <SearchResults
          className="hidden group-focus-within:block"
          append={append}
        />
      </div>

      <ScrollArea className="max-w-xl h-[384px] px-4 mt-4 mx-auto">
        {fields.map((friend, i) => (
          <div key={friend.id} className="flex flex-col w-full mt-2 first:mt-0">
            <UserCard
              fullName={friend.fullName}
              username={friend.username}
              image={friend.profileImage}
              className="w-full"
            />

            <div className="ml-auto mt-1">
              <button
                className="p-1.5 hover:bg-muted rounded-full disabled:hover:bg-transparent"
                disabled={i === 0}
                onClick={() => swap(i, i - 1)}
              >
                <ArrowUpIcon className="size-3" />
                <span className="sr-only">Move {friend.fullName} up</span>
              </button>
              <button
                className="p-1.5 hover:bg-muted rounded-full disabled:hover:bg-transparent"
                disabled={i === fields.length - 1}
                onClick={() => swap(i, i + 1)}
              >
                <ArrowDownIcon className="size-3" />
                <span className="sr-only">Move {friend.fullName} down</span>
              </button>
              <button
                className="p-1.5 hover:bg-muted rounded-full"
                onClick={() => remove(i)}
              >
                <XIcon className="size-3" />
                <span className="sr-only">Remove {friend.fullName}</span>
              </button>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
