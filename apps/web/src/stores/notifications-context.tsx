import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InferResponseType } from 'hono';
import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useMemo,
	useState,
} from 'react';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';
import { notificationsClient } from '@/lib/notifications';

export type TNotification = InferResponseType<
	typeof notificationsClient.list.$get
>[number];

type FilterMode = 'all' | 'unread' | 'read';

type State = {
	data: TNotification[];
	isLoading: boolean;
	isError: boolean;
	mode: FilterMode;
	setMode: Dispatch<SetStateAction<FilterMode>>;
	filtered: TNotification[];
	markAsRead: (id: string) => Promise<void>;
	markAllAsRead: () => Promise<void>;
	clearAll: () => Promise<void>;
	refetch: () => Promise<void>;
	unreadCount: number;
};

const options = queryOptions({
	queryKey: ['notifications'],
	queryFn: async () => {
		const res = await notificationsClient.list.$get();

		if (!res.ok) {
			throw new Error('Failed to fetch notifications');
		}

		const data = await res.json();
		return data as TNotification[];
	},
	refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
});

export const NotificationsContext = createContext<State | null>(null);

export function NotificationsContextProvider({ children }: PropsWithChildren) {
	const qc = useQueryClient();
	const isAuthenticated = useIsAuthenticated();

	const query = useQuery({
		...options,
		enabled: isAuthenticated,
	});

	const [mode, setMode] = useState<FilterMode>('all');
	const filtered = useMemo(() => {
		if (!query.data) {
			return [];
		}

		if (mode === 'all') {
			return query.data;
		}

		if (mode === 'read') {
			return query.data.filter((x) => x.readAt !== null);
		}

		return query.data.filter((x) => x.readAt === null);
	}, [query.data, mode]);

	async function clearAll() {
		const res = await notificationsClient.clear.$delete();

		if (!res.ok) {
			throw new Error('Failed to clear notifications');
		}

		await qc.invalidateQueries(options);
	}

	async function markAllAsRead() {
		const res = await notificationsClient['mark-all-read'].$post();

		if (!res.ok) {
			throw new Error('Failed to mark all as read');
		}

		await qc.invalidateQueries(options);
	}

	async function markAsRead(id: string) {
		const res = await notificationsClient['mark-read'].$post({
			json: {
				id,
			},
		});

		if (!res.ok) {
			throw new Error('Failed to mark as read');
		}

		await qc.invalidateQueries(options);
	}

	return (
		<NotificationsContext.Provider
			value={{
				data: query.data ?? [],
				clearAll,
				markAllAsRead,
				markAsRead,
				isLoading: isAuthenticated ? query.isLoading : false,
				isError: isAuthenticated ? query.isError : false,
				mode,
				setMode,
				filtered,
				refetch: async () => {
					await query.refetch();
				},
				unreadCount: (query.data ?? []).filter((x) => x.readAt === null).length,
			}}
		>
			{children}
		</NotificationsContext.Provider>
	);
}

export function useNotificationsContext() {
	const context = useContext(NotificationsContext);

	if (!context) {
		throw new Error(
			'useNotificationsContext must be used within a NotificationsContextProvider',
		);
	}

	return context;
}
