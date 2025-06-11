import { ArrowDownIcon, ArrowUpIcon, XIcon } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { UserCard } from './-card';
import type { FormInput } from './-schema';

export function List() {
  const form = useFormContext<FormInput>();
  const array = useFieldArray({
    control: form.control,
    name: 'friends',
  });
  const friends = form.watch('friends');

  return (
    <div className="mt-4">
      {friends.length === 0 && (
        <div className="text-sm text-muted-foreground my-8">
          No friends selected
        </div>
      )}

      {friends.map((friend, i) => (
        <div
          key={friend.id}
          className="flex flex-col w-full mt-2 first:mt-0"
        >
          <UserCard
            fullName={friend.fullName}
            username={friend.username}
            image={friend.profileImage}
            className="w-full"
          />

          <div className="ml-auto mt-1">
            <button
              type="button"
              className="p-1.5 hover:bg-muted rounded-full disabled:hover:bg-transparent"
              disabled={i === 0}
              onClick={() => array.swap(i, i - 1)}
            >
              <ArrowUpIcon className="size-3" />
              <span className="sr-only">Move {friend.fullName} up</span>
            </button>
            <button
              type="button"
              className="p-1.5 hover:bg-muted rounded-full disabled:hover:bg-transparent"
              disabled={i === friends.length - 1}
              onClick={() => array.swap(i, i + 1)}
            >
              <ArrowDownIcon className="size-3" />
              <span className="sr-only">Move {friend.fullName} down</span>
            </button>
            <button
              type="button"
              className="p-1.5 hover:bg-muted rounded-full"
              onClick={() => array.remove(i)}
            >
              <XIcon className="size-3" />
              <span className="sr-only">Remove {friend.fullName}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
