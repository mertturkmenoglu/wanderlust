import AppMessage from '@/components/blocks/app-message';
import UserImage from '@/components/blocks/user-image';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { LoaderCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type UseFieldArrayAppend, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { type FormInput } from '../../-schema';

type Props = {
  className?: string;
  append: UseFieldArrayAppend<FormInput>;
};

export default function SearchResults({ className, append }: Props) {
  const form = useFormContext<FormInput>();
  const friendSearch = form.watch('friendSearch') ?? '';
  const [term, setTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const query = api.useQuery(
    'get',
    '/api/v2/users/following/search',
    {
      params: {
        path: {
          username: term,
        },
      },
    },
    {
      enabled: (term?.length ?? 0) >= 4,
    },
  );

  useEffect(() => {
    if (friendSearch.length < 4) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setTerm(friendSearch);
      setIsLoading(false);
    }, 1000);
  }, [friendSearch]);

  const results = query.data?.friends;

  return (
    <Card className={cn(className)}>
      {isLoading && (
        <div className="my-8">
          <LoaderCircleIcon className="size-8 animate-spin text-primary mx-auto" />
        </div>
      )}

      {results !== undefined && (
        <div className="m-2">
          {results.length === 0 && !isLoading && (
            <AppMessage
              emptyMessage="No results found"
              showBackButton={false}
              className="my-16"
            />
          )}
          <ScrollArea className="h-64 px-2">
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

                  append({
                    id: res.id,
                    username: res.username,
                    fullName: res.fullName,
                    profileImage: res.profileImage,
                  });
                }}
              >
                <UserImage
                  src={ipx(`http://${res.profileImage ?? ''}`, 'w_512')}
                  className="size-8"
                />
                <div className="flex flex-col items-start text-sm">
                  <div className="">{res.fullName}</div>
                  <div className="text-muted-foreground text-xs">
                    @{res.username}
                  </div>
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>
      )}
    </Card>
  );
}
