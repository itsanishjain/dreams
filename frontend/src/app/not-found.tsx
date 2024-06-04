import Navbar from "@/components/Navbar";
import { lusitana } from "@/lib/fonts";
import clsx from "clsx";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <main>
      <Navbar />
      <section className="flex h-64 justify-center ">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="text-red-500" size={60} />
          <h1 className={clsx("mt-8 text-4xl md:text-6xl", lusitana.className)}>
            Page Not Found
          </h1>
          <Link className="text-xl" href="/">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
