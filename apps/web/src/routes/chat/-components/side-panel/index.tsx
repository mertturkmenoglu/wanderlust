import { Content } from './content';
import { SidePanelContextProvider } from './context';
import type { SidePanelProps } from './types';


export function SidePanel(props: SidePanelProps) {
	return (
		<SidePanelContextProvider>
			<Content {...props} />
		</SidePanelContextProvider>
	);
}
