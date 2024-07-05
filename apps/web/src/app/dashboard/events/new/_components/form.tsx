'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DatesTab from './tabs/dates-tab';
import InfoTab from './tabs/info-tab';
import LocationTab from './tabs/location-tab';

export default function NewEvent() {
  return (
    <Tabs
      defaultValue="info"
      className="max-w-4xl space-y-8"
    >
      <TabsList>
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="dates">Dates</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <InfoTab />
      </TabsContent>
      <TabsContent value="dates">
        <DatesTab />
      </TabsContent>
      <TabsContent value="location">
        <LocationTab />
      </TabsContent>
    </Tabs>
  );
}
