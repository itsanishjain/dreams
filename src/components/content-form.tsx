"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContentForm() {
  const [text, setText] = useState("");
  const [streamDream, setStreamDream] = useState("");
  const [loading, setLoading] = useState(false);

  const decodeDreams = async (e: any, dreamText: string) => {
    setStreamDream("");
    e.preventDefault();

    console.log("Dream TEXT>>>>>", dreamText);
    setLoading(true);
    const localURl = "http://127.0.0.1:8787";
    const deployedUrl = "https://wild-sky-9bb0.helloanishjain.workers.dev";
    try {
      const response = await fetch(localURl, {
        // mode: "no-cors",
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        //   dreamText,
        // }),
      });
      console.log("Running....");

      console.log("responsae>>>>>>>>>>>>>>>>>>>>>", response);
      // setLoading(false);
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // This data is a ReadableStream
      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: !done });
        text += chunkValue;

        // Process each line in the chunk
        const lines = text.split("\n");
        text = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonData = line.substring(6);
            if (jsonData === "[DONE]") {
              done = true;
              break;
            }
            try {
              const jsonResponse = JSON.parse(jsonData);
              setStreamDream((prev) => prev + jsonResponse.response);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }
      }

      // Handle any remaining text after the loop
      if (text.startsWith("data: ")) {
        const jsonData = text.substring(6);
        if (jsonData !== "[DONE]") {
          try {
            const jsonResponse = JSON.parse(jsonData);
            setStreamDream((prev) => prev + jsonResponse.response);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      }

      setLoading(false);
      // return;
    } catch (error) {
      console.log("FUCKUBG ERRIOR", error);
      setLoading(false);
      // return;
    }
  };

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
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>
          </div>
          {loading ? (
            <Button className="mt-4" size="lg">
              Loading...
            </Button>
          ) : (
            <Button
              className="mt-4"
              size="lg"
              onClick={(e) => decodeDreams(e, text)}
            >
              Decode
            </Button>
          )}
        </div>
      </form>
      <p>Response</p>
      <div>{streamDream != "" ? <div>{streamDream}</div> : "NO"}</div>
    </div>
  );
}
