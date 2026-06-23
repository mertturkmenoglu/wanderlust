import { Content } from './content';
import { TSTZPickerContextProvider } from './context';
import type { TSTZPickerProps } from './types';

export function TSTZPicker(props: TSTZPickerProps) {
	return (
		<TSTZPickerContextProvider {...props}>
			<Content />
		</TSTZPickerContextProvider>
	);
}
