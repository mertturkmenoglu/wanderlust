import { AuthContext } from '@/providers/auth-provider';
import {
  BookMarkedIcon,
  ListIcon,
  MapIcon,
  MapPinHouseIcon,
} from 'lucide-react';
import { useContext } from 'react';
import { Card } from './card';

export function QuickActions() {
  const auth = useContext(AuthContext);

  return (
    <div className="my-8">
      <div className="text-4xl">
        Hello{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-sky-600 font-bold">
          {auth.user?.fullName ?? ''}
        </span>
      </div>
      <div className="text-base my-2">How can we help you today?</div>

      <div className="grid grid-cols-2 md:grid-cols-4 mt-8 gap-2 md:gap-4">
        <Card
          to="/trips"
          Icon={MapIcon}
          text="Trips"
        />
        <Card
          to="/nearby"
          Icon={MapPinHouseIcon}
          text="Discover Nearby"
        />
        <Card
          to="/diary"
          Icon={BookMarkedIcon}
          text="Diary"
        />
        <Card
          to="/lists"
          Icon={ListIcon}
          text="My Lists"
        />
      </div>
    </div>
  );
}
