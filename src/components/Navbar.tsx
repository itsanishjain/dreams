import Link from "next/link";
import { HomeIcon } from "lucide-react";

const navItems = {
  "/blog": {
    name: "Blogs",
  },
  "/#pricing": {
    name: "Pricing",
  },
};

export default async function Navbar() {
  return (
    <div className="navbar border-b-2 border-y-gray-300">
      <div className="navbar-start">
        <div className="dropdown block md:hidden">
          <div tabIndex={0} role="button" className="btn btn-circle btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
          >
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <li key={path} className="py-1 md:hidden">
                  <a>{name}</a>
                </li>
              );
            })}
          </ul>
        </div>
        <Link href="/">
          <HomeIcon size={30} />
        </Link>
      </div>
      <div className="navbar-center">
        <ul className="menu menu-horizontal space-x-4 px-1 text-xl">
          {Object.entries(navItems).map(([path, { name }]) => {
            return (
              <Link
                key={path}
                className="hidden rounded-md p-2 hover:bg-base-300 md:flex"
                href={path}
              >
                {name}
              </Link>
            );
          })}
        </ul>
      </div>
      <div className="navbar-end text-lg">
        <>
          <Link href="/" className="rounded-md p-2 hover:bg-base-300">
            Help
          </Link>
          <Link href="/about" className="rounded-md p-2 hover:bg-base-300">
            About
          </Link>
        </>
      </div>
    </div>
  );
}
