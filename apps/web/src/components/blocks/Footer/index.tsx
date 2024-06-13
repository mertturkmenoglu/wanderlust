import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="my-20">
      <ul className="mb-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/blog">Blog</Link>
        </li>
        <li>
          <Link href="/help">FAQ</Link>
        </li>
        <li>
          <Link href="/contact-us">Contact Us</Link>
        </li>
        <li>
          <Link href="/privacy">Privacy</Link>
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
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/capreaee"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterLogoIcon className="size-6" />
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/mert-turkmenoglu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInLogoIcon className="size-6" />
          </a>
        </li>
      </ul>
      <div className="text-center text-xs text-muted-foreground">
        © 2024 Wanderlust, Inc. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
