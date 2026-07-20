import { Button } from '@wanderlust/ui/components/button';
import { ItemGroup } from '@wanderlust/ui/components/item';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@wanderlust/ui/components/popover';
import {
	ChartSplineIcon,
	CodeXmlIcon,
	GitPullRequestIcon,
	HardDriveIcon,
	ImagesIcon,
	MailIcon,
	ShieldIcon,
	TextSearchIcon,
} from 'lucide-react';
import { LinkItem } from './link-item';

const items = [
	{
		href: 'http://localhost:3003/',
		icon: ShieldIcon,
		text: 'Admin Panel',
	},
	{
		href: 'http://localhost:3006/',
		icon: TextSearchIcon,
		text: 'Typesense Dashboard',
	},
	{
		href: 'http://localhost:5000/api',
		icon: CodeXmlIcon,
		text: 'OpenAPI Spec',
	},
	{
		href: 'http://localhost:8025/',
		icon: MailIcon,
		text: 'Mailpit',
	},
	{
		href: 'http://localhost:16686/',
		icon: ChartSplineIcon,
		text: 'OTel Traces',
	},
	{
		href: 'http://localhost:23646/',
		icon: HardDriveIcon,
		text: 'Object Storage',
	},
	{
		href: 'https://github.com/mertturkmenoglu/wanderlust',
		icon: GitPullRequestIcon,
		text: 'GitHub Repository',
	},
	{
		href: 'https://github.com/mertturkmenoglu/wl-media',
		icon: ImagesIcon,
		text: 'Media Repository',
	},
];

export function Devtools() {
	return (
		<div className="fixed top-8 right-8 z-50">
			<Popover>
				<PopoverTrigger
					render={
						<Button size="default" variant="midnight">
							<img src="/logo.png" alt="Devtools panel" className="size-4" />
							<span>Dev Tools</span>
						</Button>
					}
				/>
				<PopoverContent side="bottom" align="end" sideOffset={8}>
					<ItemGroup className="gap-2">
						{items.map((item) => (
							<LinkItem key={item.href} {...item} />
						))}
					</ItemGroup>
				</PopoverContent>
			</Popover>
		</div>
	);
}
