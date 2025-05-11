import BackLink from '@/components/blocks/back-link';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DevTool } from '@hookform/devtools';
import { createFileRoute } from '@tanstack/react-router';
import { SaveIcon } from 'lucide-react';
import { FormProvider, useFormContext, useFormState } from 'react-hook-form';
import Step1 from './-components/step1';
import Step2 from './-components/step2';
import Step3 from './-components/step3';
import Step4 from './-components/step4';
import Step5 from './-components/step5';
import UnsavedDialog from './-components/unsaved-dialog';
import UnsavedChanges from './-components/unsaved-tooltip';
import { useNewDiaryEntryForm, useSaveToLocalStorage } from './-hooks';
import type { FormInput } from './-schema';

export const Route = createFileRoute('/diary/new/')({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useNewDiaryEntryForm();

  return (
    <>
      <FormProvider {...form}>
        <InnerContent />
      </FormProvider>
      <DevTool control={form.control} />

      <UnsavedDialog form={form} />
    </>
  );
}

function InnerContent() {
  const form = useFormContext<FormInput>();
  const { saveStatus, saveText, saveToLocalStorage } =
    useSaveToLocalStorage(form);
  const state = useFormState(form);

  return (
    <div className="max-w-7xl mx-auto my-8">
      <BackLink href="/diary" text="Go back to your diary" />

      <Tabs defaultValue="1" className="mt-8 max-w-xl mx-auto">
        <div className="w-full flex">
          <TabsList className="w-full">
            <TabsTrigger value="1">Info</TabsTrigger>
            <TabsTrigger value="2">Locations</TabsTrigger>
            <TabsTrigger value="3">Friends</TabsTrigger>
            <TabsTrigger value="4">Media</TabsTrigger>
            <TabsTrigger value="5">Review</TabsTrigger>
          </TabsList>
        </div>

        <div className="my-4 grid grid-cols-2 items-center">
          <div>
            {state.isDirty ? (
              <UnsavedChanges />
            ) : saveStatus !== 'idle' ? (
              <div>{saveText}</div>
            ) : (
              <></>
            )}
          </div>
          <button
            className="ml-auto px-4 py-2 hover:bg-muted rounded text-secondary-foreground text-sm flex items-center gap-2"
            disabled={saveStatus !== 'idle'}
            onClick={() => saveToLocalStorage()}
          >
            <SaveIcon className="size-4" />
            <span>{saveText}</span>
          </button>
        </div>

        <TabsContent value="1">
          <Step1 />
        </TabsContent>
        <TabsContent value="2">
          <Step2 />
        </TabsContent>
        <TabsContent value="3">
          <Step3 />
        </TabsContent>
        <TabsContent value="4">
          <Step4 />
        </TabsContent>
        <TabsContent value="5">
          <Step5 />
        </TabsContent>
      </Tabs>
    </div>
  );
}
