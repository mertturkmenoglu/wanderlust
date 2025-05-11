import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useBlocker } from '@tanstack/react-router';
import { useFormState } from 'react-hook-form';
import type { FormType } from '../-hooks';

type Props = {
  form: FormType;
};

export default function UnsavedDialog({ form }: Props) {
  const state = useFormState(form);

  const blocker = useBlocker({
    shouldBlockFn: ({ current, next }) => {
      return state.isDirty && current.pathname !== next.pathname;
    },
    withResolver: true,
  });

  if (blocker.status === 'idle') {
    return <></>;
  }

  return (
    <AlertDialog open={blocker.status === 'blocked'}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-4 py-2">
          You have unsaved changes. You will lose your progress. Do you want to
          proceed?
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => blocker.reset()}>
            No
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => blocker.proceed()}>
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
