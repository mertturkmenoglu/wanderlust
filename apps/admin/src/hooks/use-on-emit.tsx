import type { Emitter, EventsMap } from 'nanoevents';
import { useEffect, useRef } from 'react';

export function useOnEmit<Events extends EventsMap, Event extends keyof Events>(
	emitter: Emitter<Events>,
	event: Event,
	callback: Events[Event],
): void {
	const cbRef = useRef(callback);

	useEffect(() => {
		cbRef.current = callback;
	}, [callback]);

	useEffect(() => {
		const listener = (...args: Parameters<Events[Event]>) =>
			cbRef.current(...args);

		//@ts-expect-error
		const unbind = emitter.on(event, listener);
		return unbind;
	}, [emitter, event]);
}
