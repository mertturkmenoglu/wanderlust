import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { type FormInput, schema } from './-schema';

export function useNewDiaryEntryForm() {
  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date(),
      shareWithFriends: false,
      locations: [],
      friends: [],
      friendSearch: '',
    },
    criteriaMode: 'all',
    shouldFocusError: true,
    mode: 'onChange',
  });

  useEffect(() => {
    const v = localStorage.getItem('diary-entry');

    if (!v) {
      return;
    }

    try {
      const parsed = schema.parse(JSON.parse(v));
      form.reset({
        ...parsed,
        date: new Date(parsed.date),
      });
    } catch (e) {}
  }, []);

  return form;
}

export type FormType = UseFormReturn<FormInput, any, FormInput>;

export type SaveStatus = 'saving' | 'saved' | 'idle';

export function useSaveToLocalStorage(form: FormType) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const saveToLocalStorage = async () => {
    setSaveStatus('saving');

    if (!form.formState.isValid) {
      toast.error('Check your form values.');
      setSaveStatus('idle');
      return;
    }

    await new Promise((res) => setTimeout(res, 1000));

    localStorage.setItem(
      'diary-entry',
      JSON.stringify({ ...form.getValues(), friendSearch: '' }),
    );
    form.reset(form.getValues());

    setSaveStatus('saved');

    toast.success('Diary entry saved');

    await new Promise((res) => setTimeout(res, 1000));

    setSaveStatus('idle');
  };

  const saveText = useMemo(() => {
    if (saveStatus === 'saving') {
      return 'Saving...';
    }

    if (saveStatus === 'saved') {
      return 'Saved';
    }

    return 'Save';
  }, [saveStatus]);

  return { saveStatus, setSaveStatus, saveToLocalStorage, saveText };
}

export type UseSaveReturn = ReturnType<typeof useSaveToLocalStorage>;
