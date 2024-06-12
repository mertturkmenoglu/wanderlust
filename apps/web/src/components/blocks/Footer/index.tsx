import { GithubIcon, FacebookIcon, TwitterIcon, YoutubeIcon, InstagramIcon } from "lucide-react";
import Link from "next/link";

function Footer() {

  return (
    <footer className="my-20">
      <ul className="flex justify-center items-center gap-8 mb-8">
        <li>
          <Link href="/about">
            About
          </Link>
        </li>
        <li>
          <Link href="/blog">
            Blog
          </Link>
        </li>
        <li>
          <Link href="/help">
            FAQ
          </Link>
        </li>
        <li>
          <Link href="/contact-us">
            Contact Us
          </Link>
        </li>
        <li>
          <Link href="/privacy">
            Privacy
          </Link>
        </li>
      </ul>
      <ul className="flex justify-center items-center gap-8 mb-8">
        <li>
          <Link href="https://github.com/">
            <GithubIcon className="size-6" />
          </Link>
        </li>
        <li>
          <Link href="https://www.facebook.com/">
            <FacebookIcon className="size-6" />
          </Link>
        </li>
        <li>
          <Link href="https://twitter.com/home">
            <TwitterIcon className="size-6" />
          </Link>
        </li>
        <li>
          <Link href="https://youtube.com/">
            <YoutubeIcon className="size-6" />
          </Link>
        </li>
        <li>
          <Link href="https://instagram.com/">
            <InstagramIcon className="size-6" />
          </Link>
        </li>
      </ul>
      <div className="text-center">© 2024 Wanderlust, Inc. All rights reserved.</div>
    </footer>
  );
}

export default Footer;
