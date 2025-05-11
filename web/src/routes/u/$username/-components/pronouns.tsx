import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

type Props = {
  pronouns: string;
};

export default function Pronouns({ pronouns }: Props) {
  return (
    <div className="flex items-center space-x-1 mt-2">
      <span className="text-sm text-gray-500">{pronouns}</span>
      <a
        href={`https://en.pronouns.page/${pronouns}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <QuestionMarkCircledIcon className="size-4 text-gray-500" />
      </a>
    </div>
  );
}
