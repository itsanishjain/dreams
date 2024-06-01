import Link from "next/link";
import React from "react";

export default function Cta() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="0 relative isolate mt-8 flex justify-center overflow-hidden px-6 sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
        <div className="mx-auto max-w-6xl text-center lg:mx-0 lg:flex-auto">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-6xl">
            Create Badges, for your business.
            <br />
            <span className="inline-block bg-gradient-to-r from-green-600 via-green-500 to-yellow-400 bg-clip-text text-transparent">
              Fast and Cheap.
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}
