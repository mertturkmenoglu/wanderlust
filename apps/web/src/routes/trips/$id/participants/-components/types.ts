import type { Outputs } from '@/lib/orpc';

type Participant = Outputs['trips']['get']['trip']['participants'][number];

export type TripParticipant = Omit<Participant, 'role'> & {
	role: 'owner' | 'editor' | 'member';
};
