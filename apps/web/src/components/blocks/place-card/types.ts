import type { components } from '@/lib/api-types';

export type Place = Pick<
  components['schemas']['Place'],
  | 'id'
  | 'name'
  | 'category'
  | 'address'
  | 'totalVotes'
  | 'totalPoints'
  | 'assets'
>;

export type Props = {
  place: Place;
  hoverEffects?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;
