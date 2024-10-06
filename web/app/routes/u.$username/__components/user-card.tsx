import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { BadgeCheckIcon } from 'lucide-react';

type Props = {
  fullName: string;
  username: string;
  isVerified: boolean;
  image: string | null;
};

export default function UserCard({
  fullName,
  username,
  isVerified,
  image,
}: Props) {
  return (
    <Card className="p-4">
      <CardHeader className="flex flex-row items-center gap-4">
        <img
          src={image ?? ''}
          className="h-12 w-12 rounded-full"
          alt={fullName}
        />
        <div>
          <CardTitle className="flex flex-row items-center gap-2">
            {fullName}{' '}
            {isVerified && <BadgeCheckIcon className="size-6 text-primary" />}
          </CardTitle>
          <CardDescription>@{username}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
