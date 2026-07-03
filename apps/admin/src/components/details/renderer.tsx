import { Link, type LinkOptions } from '@tanstack/react-router';
import { Badge } from '@wanderlust/ui/components/badge';
import { Button, buttonVariants } from '@wanderlust/ui/components/button';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { format } from 'date-fns';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import React from 'react';

export const renderer = {
	Image: (src: string) => (
		<img src={src} alt={''} className="aspect-video h-32 object-cover" />
	),
	ExternalLink: (text: string, href: string) => (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="text-primary underline"
		>
			{text}
		</a>
	),
	Link: (text: string, options: LinkOptions, children: React.ReactNode) => (
		<div className="flex flex-col items-start">
			<Link
				{...options}
				className={buttonVariants({ variant: 'link', className: 'px-0!' })}
			>
				<span>{text}</span>
				<ArrowRightIcon />
			</Link>
			<div className="block">{children}</div>
		</div>
	),
	JSON: (data: unknown) => (
		<pre className="text-wrap">{JSON.stringify(data, null, 2)}</pre>
	),
	Multiple: (data: React.ReactNode[]) => (
		<ItemGroup className="gap-2">
			{data.map((item, index) => (
				<React.Fragment key={index}>{item}</React.Fragment>
			))}
		</ItemGroup>
	),
	Array: (data: React.ReactNode[], vertical = false) => (
		<ul
			className={cn('flex flex-wrap gap-1', {
				'flex-row': !vertical,
				'flex-col': vertical,
			})}
		>
			{data.map((item, index) => (
				<li key={index}>
					<Badge>{item}</Badge>
				</li>
			))}
		</ul>
	),
	Date: (date: Date) => (
		<Button size="sm" variant="outline">
			<span>{format(date, 'PP p')}</span>
			<ClockIcon className="size-4" />
		</Button>
	),
	Gallery: (images: string[]) => (
		<div className="flex w-3xl flex-wrap gap-4">
			{images.map((image) => (
				<div key={image}>{renderer.Image(image)}</div>
			))}
		</div>
	),
};
