"use client";

// import { authenticate } from "@/lib/actions";
import { lusitana } from "@/lib/fonts";
import { Textarea } from "@/components/ui/textarea";

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";

export default function ContentForm() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      <form className="space-y-3">
        <div className="flex-1 rounded-lg bg-secondary px-6 p-2">
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium"
                htmlFor="email"
              >
                type your Dream...
              </label>
              <div className="relative">
                <Textarea
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                  id="dream"
                  name="dream"
                  placeholder="type your dream"
                  required
                />
              </div>
            </div>
          </div>
          <Button className="mt-4" size="lg">
            Decode
          </Button>
        </div>
      </form>
      <p>Response</p>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
