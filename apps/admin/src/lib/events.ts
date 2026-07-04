import { createNanoEvents } from 'nanoevents';

export const upsertEmitter = createNanoEvents<{
	isDirty: (data: boolean) => void;
}>();
