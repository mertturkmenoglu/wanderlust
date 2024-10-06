import { cn } from "~/lib/utils";

type Props = {
  bio: string | null;
  website: string | null;
  isBusinessAccount: boolean;
  className?: string;
};

export default function Info({
  bio,
  website,
  isBusinessAccount,
  className,
}: Props) {
  return (
    <div className={cn(className)}>
      {bio && <p className="leading-7 [&:not(:first-child)]:mt-6">{bio}</p>}
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {website}
        </a>
      )}
      <p>
        {isBusinessAccount && (
          <span className="text-primary">Business Account</span>
        )}
      </p>
    </div>
  );
}
