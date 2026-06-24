import { useEffect } from 'react';

export function useHandleClickOutside(
	ref: React.RefObject<HTMLDivElement | null>,
	onClickOutside: () => void,
) {
	useEffect(() => {
		const handle = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				onClickOutside();
			}
		};

		document.addEventListener('mousedown', handle);

		return () => document.removeEventListener('mousedown', handle);
	}, [onClickOutside, ref]);
}
