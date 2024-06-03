import Link from "next/link";
import Image from "next/image";
// import { auth, signOut } from "@/auth";
// import SignOut from "./SignOut";

const navItems = {
  "/": {
    name: "Features",
  },
  "/blog": {
    name: "Blogs",
  },
  "/#pricing": {
    name: "Pricing",
  },
  "/dashboard": {
    name: "Dashboard",
  },
};

export default async function MainNavbar() {
  //   const session = await auth();
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
          <span className="h-full w-full rounded-full">
            <Image src="/logo.png" width={50} height={50} alt="logo" />
          </span>
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
        {/* {session ? (
          <SignOut />
        ) : (
          <>
            <Link
              href="/auth/login"
              className="rounded-md p-2 hover:bg-base-300"
            >
              Login
            </Link>
            <Link
              href="/auth/login"
              className="rounded-md p-2 hover:bg-base-300"
            >
              Signup
            </Link>
          </>
        )} */}
      </div>
    </div>
  );
}
