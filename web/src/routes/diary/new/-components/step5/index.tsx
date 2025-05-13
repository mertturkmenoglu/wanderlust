import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { type FormInput } from '../../-schema';

function strOrDefault(s: string, defaultValue: string): string {
  return s === '' ? defaultValue : s;
}

export default function Step5() {
  const form = useFormContext<FormInput>();
  const [share, setShare] = useState(form.getValues('shareWithFriends'));

  const description = form.watch('description');
  const title = form.watch('title');
  const date = form.watch('date');
  const locations = form.watch('locations');
  const friends = form.watch('friends');

  const shortDescription =
    description.length > 256 ? description.slice(0, 256) + '...' : description;

  const canCreateEntry = form.formState.isValid;

  const navigate = useNavigate();

  const entryMutation = useMutation({
    mutationKey: ['create-diary-entry'],
    mutationFn: async () => {
      // form.reset(form.getValues());
      // const values = form.getValues();
      // const dto: CreateDiaryEntryRequestDto = {
      //   date: values.date.toISOString(),
      //   description: values.description,
      //   shareWithFriends: values.shareWithFriends,
      //   title: values.title,
      //   friends: values.friends.map((f) => f.id),
      //   locations: values.locations.map((l) => ({
      //     id: l.id,
      //     description: l.description === '' ? null : l.description,
      //   })),
      // };
      // return createDiaryEntry(dto);
    },
    onSuccess: () => {
      // uploadMutation.mutate({ entryId: res.data.id });
    },
  });

  const uploadMutation = useMutation({
    mutationKey: ['upload-diary-entry-media'],
    mutationFn: async () => {},
  });

  return (
    <div className="flex flex-col mx-auto max-w-xl mt-4">
      <div>
        <h3 className="text-muted-foreground text-lg">Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
          <div>Title:</div>
          <div>{strOrDefault(title, 'No title')}</div>
          <div>Description:</div>
          <div>{strOrDefault(shortDescription, 'No description')}</div>
          <div>Date:</div>
          <div>{date.toLocaleDateString()}</div>
          <div>Locations:</div>
          <ul>
            {locations.map((l) => (
              <li key={l.id} className="list-disc list-outside">
                {l.name}
              </li>
            ))}
            {locations.length === 0 && <div>No locations</div>}
          </ul>
          <div>Friends:</div>
          <ul>
            {friends.map((f) => (
              <li key={f.id} className="list-disc list-outside">
                {f.fullName}
              </li>
            ))}
            {friends.length === 0 && <div>No friends</div>}
          </ul>
          <div>Media:</div>
          {/* <div>
            {fileCount > 0 ? 'Selected ' + fileCount + ' files' : 'No files'}
          </div> */}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Checkbox
          checked={share}
          onCheckedChange={() => {
            setShare((prev) => {
              form.setValue('shareWithFriends', !prev);
              return !prev;
            });
          }}
        />
        <Label htmlFor="share-with-friends">Share with friends</Label>
      </div>

      <Button
        className="mt-4"
        disabled={!canCreateEntry}
        onClick={() => {
          entryMutation.mutate();
        }}
      >
        Create Diary Entry
      </Button>
    </div>
  );
}
