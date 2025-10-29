import type { components } from '@/lib/api-types';

export type Poi = Pick<
  components['schemas']['Poi'],
  | 'id'
  | 'name'
  | 'category'
  | 'address'
  | 'totalVotes'
  | 'totalPoints'
  | 'images'
>;

export type Props = {
  poi: Poi;
  hoverEffects?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;
