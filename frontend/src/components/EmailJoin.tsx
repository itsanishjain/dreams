"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { addEmail } from "@/lib/actions";

export function EmailJoin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className="mt-4 w-full rounded-md bg-secondary relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-green-200 to-green-600  text-center font-sans font-bold">
          Join us
        </h1>
        <p></p>
        <p className="max-w-lg mx-auto my-2 text-md text-center relative z-10">
          Your Nighttime Visions Unveil Your Waking Life. <br /> follow us{" "}
          <a
            className="text-blue-300"
            href="https://twitter.com/attaboiaj"
            target="_blank"
          >
            twitter/x
          </a>
        </p>
        <input
          type="email"
          required
          placeholder="hi@example.com"
          className="p-4 rounded-lg border border-neutral-800 focus:ring-2 focus:ring-teal-500  w-full relative z-10 mt-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button
        className="my-4"
        onClick={async () => {
          if (!email) return;
          console.log("CLICKED");
          setLoading(true);
          await addEmail(email);
          setLoading(false);
        }}
        size="lg"
      >
        {loading ? "loading...." : "Join"}
      </Button>
    </div>
  );
}
