import { Link } from '@tanstack/react-router';
import { Button, buttonVariants } from '@wanderlust/ui/components/button';
import { ChevronRightIcon } from 'lucide-react';
import { ActionBanner, type ActionBannerProps } from './action';
import { GradientBanner, type GradientBannerProps } from './gradient';
import { OverlayBanner, type OverlayBannerProps } from './overlay';
import { VerticalBanner, type VerticalBannerProps } from './vertical';

export type AppBannerProps = Pick<OverlayBannerProps, 'classNames'>;

export function AppBanner({
	classNames = {
		root: 'my-8',
		message: 'text-white text-shadow-lg text-shadow-midnight',
		messageContainer: 'rounded-none',
	},
}: AppBannerProps) {
	return (
		<OverlayBanner
			image="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
			alt="Wanderlust Banner Image"
			message="Inspiring explorations, one spark of Wanderlust!"
			attr={{
				text: 'Photo by Luca Bravo on Unsplash',
				link: 'https://unsplash.com/photos/brown-wooden-boat-moving-towards-the-mountain-O453M2Liufs',
			}}
			classNames={classNames}
		/>
	);
}

export type CategoriesBannerProps = Pick<OverlayBannerProps, 'classNames'>;

export function CategoriesBanner({
	classNames = {
		root: 'my-8',
		image: 'aspect-[2]',
	},
}: CategoriesBannerProps) {
	return (
		<OverlayBanner
			image="https://img.magnific.com/free-photo/portrait-happy-tourist-woman-holding-passport-holiday-white-background_1258-112708.jpg?w=2000"
			alt="Categories Banner Image"
			message={
				<div className="flex items-center gap-4">
					<div className="text-sm md:text-base">
						Discover the world around you
					</div>
					<Link
						to="/categories"
						className={buttonVariants({
							variant: 'warning',
							size: 'default',
						})}
					>
						<span className="text-midnight">See categories</span>
						<ChevronRightIcon className="text-midnight" />
					</Link>
				</div>
			}
			attr={{
				text: 'designed by benzoix - Magnific.com',
				link: 'https://magnific.com',
			}}
			classNames={classNames}
		/>
	);
}

export type NearbyLocationsBannerProps = Pick<
	VerticalBannerProps,
	'classNames'
>;

export function NearbyLocationsBanner({
	classNames,
}: NearbyLocationsBannerProps) {
	return (
		<VerticalBanner
			image="https://i.imgur.com/Y3ujIqE.jpg"
			alt="Nearby Locations Banner Image"
			classNames={classNames}
			content={
				<div className="text-center">
					<h2 className="mt-8 font-bold font-serif text-3xl text-black/80">
						Discover new locations around you
					</h2>
					<p className="font-serif text-muted-foreground">
						Find new places to explore and enjoy with your friends and family.
					</p>
					<Button asChild size="lg" variant="secondary" className="mt-8">
						<Link to="/nearby">Start Exploring</Link>
					</Button>
				</div>
			}
		/>
	);
}

export type TripPlannerBannerProps = Pick<ActionBannerProps, 'classNames'>;

export function TripPlannerBanner({ classNames }: TripPlannerBannerProps) {
	return (
		<ActionBanner
			image="https://i.imgur.com/mWzmPRv.jpg"
			alt="Trip Planner Banner Image"
			message={
				<div className="flex flex-col gap-4">
					<div className="font-bold text-2xl text-primary">
						Plan your next trip
					</div>
					<div className="text-muted-foreground text-sm">
						Plan your next trip with our trip planner tool. It&apos;s easy to
						use and you can save your trips for later.
					</div>
					<Button asChild variant="default">
						<Link to="/trips/planner" className="text-white">
							Go to Trip Planner
						</Link>
					</Button>
				</div>
			}
			classNames={classNames}
			lefty={false}
		/>
	);
}

export type EventBannerProps = Pick<ActionBannerProps, 'classNames'>;

export function EventBanner({ classNames }: EventBannerProps) {
	return (
		<ActionBanner
			image="https://i.imgur.com/CNtFbZT.jpg"
			alt="Events Banner Image"
			message={
				<div className="flex flex-col gap-4">
					<div className="font-bold text-2xl text-primary">
						Explore Upcoming Events
					</div>
					<div className="text-muted-foreground text-sm">
						Check out the upcoming events in your area. You can also add your
						own events to the list.
					</div>
					<Button asChild variant="secondary">
						<Link to="/discover/events">See events</Link>
					</Button>
				</div>
			}
			classNames={classNames}
			lefty={false}
		/>
	);
}

export type TripPlannerCtaProps = Pick<GradientBannerProps, 'classNames'>;

export function TripPlannerCta({ classNames }: TripPlannerCtaProps) {
	return (
		<GradientBanner
			classNames={classNames}
			left={
				<>
					<div className="text-4xl">Ready to travel?</div>
					<div className="text-xl">
						Plan your next adventure with Wanderlust.
					</div>
				</>
			}
			right={
				<Button asChild size="lg" variant="midnight">
					<Link to="/trips/planner">
						Start Planning <ChevronRightIcon />
					</Link>
				</Button>
			}
		/>
	);
}
