import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { Activity, useState } from 'react';
import type { UpsertProps } from '@/components/form/upsert';
import type { Collection } from '@/resources/collections';
import { TabForm } from './tab-form';
import { TabItems } from './tab-items';

export function Upsert(props: UpsertProps<Collection>) {
	const [tab, setTab] = useState<'form' | 'items'>('form');

	return (
		<div className="flex flex-col gap-4">
			<ButtonGroup className="w-full justify-center">
				<Button
					variant={tab === 'form' ? 'default' : 'outline'}
					onClick={() => setTab('form')}
					className="w-xs"
				>
					Collection
				</Button>
				<Button
					variant={tab === 'items' ? 'default' : 'outline'}
					onClick={() => setTab('items')}
					className="w-xs"
					disabled={props.action === 'create'}
				>
					Items
				</Button>
			</ButtonGroup>
			<Activity mode={tab === 'form' ? 'visible' : 'hidden'}>
				<TabForm {...props} />
			</Activity>
			<Activity mode={tab === 'items' ? 'visible' : 'hidden'}>
				<TabItems {...props} />
			</Activity>
		</div>
	);
}
