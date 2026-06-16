import {
	GitHubLogoIcon,
	LinkedInLogoIcon,
	TwitterLogoIcon,
} from '@radix-ui/react-icons';
import { Link } from '@tanstack/react-router';

export function Footer() {
	return (
		<footer className="my-20">
			<ul className="mb-8 flex items-center justify-center gap-4 text-muted-foreground text-sm md:gap-8">
				<li>
					<Link to="/help" hash={encodeURI('General Questions')}>
						About
					</Link>
				</li>
				<li>
					<Link to="/help">FAQ</Link>
				</li>
				<li>
					<Link to="/terms">Terms</Link>
				</li>
				<li>
					<Link to="/privacy">Privacy</Link>
				</li>
			</ul>
			<ul className="mb-8 flex items-center justify-center gap-8 text-muted-foreground">
				<li>
					<a
						href="https://github.com/mertturkmenoglu/wanderlust"
						target="_blank"
						rel="noopener noreferrer"
					>
						<GitHubLogoIcon className="size-6" />
						<span className="sr-only">GitHub</span>
					</a>
				</li>
				<li>
					<a
						href="https://twitter.com/AsyncSquirrel"
						target="_blank"
						rel="noopener noreferrer"
					>
						<TwitterLogoIcon className="size-6" />
						<span className="sr-only">Twitter</span>
					</a>
				</li>
				<li>
					<a
						href="https://www.linkedin.com/in/mert-turkmenoglu/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<LinkedInLogoIcon className="size-6" />
						<span className="sr-only">LinkedIn</span>
					</a>
				</li>
			</ul>
			<div className="text-center text-muted-foreground text-xs">
				© {new Date().getFullYear()} Wanderlust, Inc. All rights reserved.
			</div>
		</footer>
	);
}
