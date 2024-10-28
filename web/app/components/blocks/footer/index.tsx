import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";

export default function Footer() {
  return (
    <footer className="my-20">
      <ul className="mb-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
        <li>
          <Link to="/help">FAQ</Link>
        </li>
        <li>
          <Link to="/contact-us">Contact Us</Link>
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
            href="https://twitter.com/capreaee"
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
      <div className="text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Wanderlust, Inc. All rights reserved.
      </div>
    </footer>
  );
}
