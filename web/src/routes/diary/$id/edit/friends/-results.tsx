import AppMessage from '@/components/blocks/app-message';
import UserImage from '@/components/blocks/user-image';
import Spinner from '@/components/kit/spinner';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import type { FormInput } from './-schema';

type Props = {
  className?: string;
};

export default function SearchResults({ className }: Props) {
  const form = useFormContext<FormInput>();
  const array = useFieldArray({
    control: form.control,
    name: 'friends',
  });
  const friendSearch = form.watch('friendSearch') ?? '';
  const [term] = useDebouncedValue(friendSearch, {
    wait: 500,
  });

  const query = api.useQuery(
    'get',
    '/api/v2/users/search/following',
    {
      params: {
        query: {
          username: term,
        },
      },
    },
    {
      enabled: term.length > 1,
    },
  );

  const results = query.data?.friends;

  if (query.isFetching) {
    return (
      <Card className={cn(className)}>
        <Spinner className="my-8 mx-auto size-8" />
      </Card>
    );
  }

  if (results === undefined || results.length === 0) {
    return (
      <Card className={cn(className)}>
        <AppMessage
          emptyMessage="No results found"
          showBackButton={false}
          className="my-16"
        />
      </Card>
    );
  }

  return (
    <Card className={cn('gap-0 p-2', className)}>
      {results.map((res) => (
        <button
          key={res.id}
          className="flex gap-4 items-center hover:bg-muted p-2 rounded-md w-full"
          onClick={() => {
            const maxAllowedCount = 32;
            const friends = form.getValues('friends');
            const alreadyInList =
              friends.find((lo) => lo.id === res.id) !== undefined;

            if (alreadyInList) {
              toast.error('User is already added.');
              return;
            }

            if (friends.length >= maxAllowedCount) {
              toast.error(`Maximum ${maxAllowedCount} can be added.`);
              return;
            }

            console.log('appending');
            console.log({ beforeLen: array.fields.length });
            array.append({
              id: res.id,
              username: res.username,
              fullName: res.fullName,
              profileImage: res.profileImage,
            });
            console.log({ len: array.fields.length });
          }}
        >
          <UserImage
            src={ipx(`http://${res.profileImage ?? ''}`, 'w_512')}
            className="size-8"
          />
          <div className="flex flex-col items-start text-sm">
            <div className="">{res.fullName}</div>
            <div className="text-muted-foreground text-xs">@{res.username}</div>
          </div>
        </button>
      ))}
    </Card>
  );
}
