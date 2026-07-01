import { Link, type LinkOptions } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';

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
		<div className="flex flex-col gap-2">
			<Link {...options} className={buttonVariants({ variant: 'link' })}>
				{text}
			</Link>
			<div className="block">{children}</div>
		</div>
	),
	JSON: (data: unknown) => (
		<pre className="text-wrap">{JSON.stringify(data, null, 2)}</pre>
	),
	Date: (date: Date) => date.toISOString(),
	Gallery: (images: string[]) => (
		<div className="flex w-3xl flex-wrap gap-4">
			{images.map((image) => (
				<div key={image}>{renderer.Image(image)}</div>
			))}
		</div>
	),
};
