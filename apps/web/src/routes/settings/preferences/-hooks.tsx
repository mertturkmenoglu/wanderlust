import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	preferencesSchema,
	usePreferencesStore,
} from '@/stores/preferences-context';

export function usePreferencesForm() {
	const preferences = usePreferencesStore((s) => s.preferences);

	return useForm({
		resolver: zodResolver(preferencesSchema),
		defaultValues: preferences,
	});
}
