import { GithubIcon, FacebookIcon, TwitterIcon, YoutubeIcon, InstagramIcon } from "lucide-react";

function Footer() {

  return (
    <footer className="my-20">
      <ul className="flex justify-center items-center gap-8 mb-8">
        <li>About</li>
        <li>Blog</li>
        <li>FAQ</li>
        <li>Contact Us</li>
        <li>Privacy</li>
      </ul>
      <ul className="flex justify-center items-center gap-8 mb-8">
        <li>
          <GithubIcon className="size-6" />
        </li>
        <li>
          <FacebookIcon className="size-6" />
        </li>
        <li>
          <TwitterIcon className="size-6" />
        </li>
        <li>
          <YoutubeIcon className="size-6" />
        </li>
        <li>
          <InstagramIcon className="size-6" />
        </li>
      </ul>
      <div className="text-center">© 2024 Wanderlust, Inc. All rights reserved.</div>
    </footer>
  );
}

export default Footer;
