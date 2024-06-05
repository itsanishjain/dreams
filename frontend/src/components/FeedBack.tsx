"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

import { addFeedback } from "@/lib/actions";

import toast from "react-hot-toast";

export function FeedBack() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Feedback</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Share Feedback</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Textarea
            className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500 h-[150px]"
            id="feedback"
            name="feedback"
            placeholder="What if..."
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={async () => {
              if (!text) return;
              setLoading(true);
              await addFeedback(text);
              setLoading(false);
              toast.success("send successfully");
            }}
          >
            {loading ? "loading...." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
