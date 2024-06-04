import Link from "next/link";
import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

const Footer = () => {
  return (
    <footer
      className={`footer mt-8 bg-black p-10 text-white ${inter.className}`}
    >
      <aside>
        <Link href="/">
          <span className="h-full w-full rounded-full text-4xl">😴</span>
        </Link>
        <p>
          Dreams.
          <br />
          Providing reliable tech since 2024
        </p>
      </aside>
      <nav>
        <header className="footer-title">Services</header>
        <a className="link-hover link">Branding</a>
        <a className="link-hover link">Design</a>
        <a className="link-hover link">Marketing</a>
        <a className="link-hover link">Advertisement</a>
      </nav>
      <nav>
        <header className="footer-title">Company</header>
        <Link href="/about" className="link-hover link">
          About us
        </Link>
        <Link href="/support" className="link-hover link">
          Suppot
        </Link>
        <Link href="/cancellation" className="link-hover link">
          Cancellation
        </Link>
        <a className="link-hover link">Press kit</a>
      </nav>
      <nav>
        <header className="footer-title">Legal</header>
        <Link href="/terms-of-service" className="link-hover link">
          Terms of use
        </Link>
        <Link href="/privacy-policy" className="link-hover link">
          Privacy policy
        </Link>
        <Link href="/cookie-policy" className="link-hover link">
          Cookie policy
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
