'use client';

import AppMessage from '@/components/blocks/app-message';

export default function Page() {
  return (
    <div className="flex justify-center">
      <AppMessage
        showBackButton={false}
        emptyMessage={
          <div className="text-center">
            <h2>Your Admin Dashboard</h2>
            <div className="text-sm">Select an action from sidebar</div>
          </div>
        }
      />
    </div>
  );
}
