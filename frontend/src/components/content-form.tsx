"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LOCAL_API_URL, DEPLOYED_API_URL } from "@/lib/constants";
import toast from "react-hot-toast";
import { lusitana } from "@/lib/fonts";
import clsx from "clsx";

export default function ContentForm() {
  const [text, setText] = useState("");
  const [streamDream, setStreamDream] = useState("");
  const [analysisOfDream, setAnalysisOfDream] = useState("");
  const [IsanalysisOfDreamDone, setIsAnalysisOfDreamDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const [whatButton, setWhatButton] = useState("");

  const decodeDreams = async (e: any, dreamText: string) => {
    if (dreamText == "") {
      toast.error("Please type your dream");
      return;
    }
    setStreamDream("");
    e.preventDefault();

    setWhatButton("Decode");

    setLoading(true);
    const url =
      process.env.NODE_ENV != "development" ? DEPLOYED_API_URL : LOCAL_API_URL;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dreamText,
        }),
      });

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
    } catch (error) {
      console.log("FUCKUBG ERRIOR", error);
      setLoading(false);
    } finally {
      setWhatButton("");
    }
  };

  const analDreams = async (e: any, dreamText: string) => {
    if (dreamText == "") {
      toast.error("Please type your dream");
      return;
    }
    setAnalysisOfDream("");
    setIsAnalysisOfDreamDone(false);
    e.preventDefault();

    setWhatButton("Analysis");

    setLoading(true);
    const url =
      process.env.NODE_ENV != "development" ? DEPLOYED_API_URL : LOCAL_API_URL;
    try {
      const response = await fetch(`${url}/analysis`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dreamText,
        }),
      });

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
      let fullResponse = "";

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
              fullResponse += jsonResponse.response;
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
            fullResponse += jsonResponse.response;
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      }

      setAnalysisOfDream(fullResponse);
      setIsAnalysisOfDreamDone(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setWhatButton("");
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
          <div className="flex justify-center items-center">
            {loading ? (
              <Button className="mt-4" size="lg">
                Loading...
              </Button>
            ) : (
              <div className="flex space-x-4">
                <Button
                  className="mt-4"
                  size="lg"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    decodeDreams(e, text)
                  }
                >
                  Decode
                </Button>

                <Button
                  className="mt-4"
                  size="lg"
                  variant="outline"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    analDreams(e, text)
                  }
                >
                  Analysis
                </Button>
              </div>
            )}
          </div>
        </div>
      </form>
      <p className={clsx(lusitana.className, "text-2xl")}>{whatButton}</p>
      <div>
        {streamDream != "" ? (
          <div className="flex-1 rounded-lg bg-secondary px-6 p-2">
            {streamDream}
          </div>
        ) : null}
      </div>
      {analysisOfDream ? (
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(JSON.parse(analysisOfDream)).map(([type, value]) => (
            <Card title={type} value={value} key={type} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Card({ title, value }: { title: string; value: any }) {
  const dreamEmojis: any = {
    isFunny: "😂",
    isDark: "🌚",
    isFrightening: "😨",
    isAnxious: "😰",
    isSad: "😢",
    isJoyful: "😊",
    isConfusing: "😕",
    isExhilarating: "🤩",
    isEmbarrassing: "😳",
    isErotic: "😏",
    isNostalgic: "😊", // No perfect emoji for nostalgia
    isSurreal: "🌈",
    isLucid: "🧠",
    isRecurring: "🔄",
    symbolism: "🔮",
  };
  const Icon = dreamEmojis[title];

  return (
    <div className="rounded-xl bg-secondary p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? (
          <span className="h-full w-full rounded-full text-4xl">{Icon}</span>
        ) : null}
        <h3 className="ml-2 text-md font-medium">{title}</h3>
      </div>
      {title === "symbolism" ? (
        <div
          className={`${lusitana.className}
            truncate rounded-xl bg-accent px-4 py-8 text-center text-2xl`}
        >
          {value.map((item: string, index: number) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      ) : (
        <p
          className={`${lusitana.className}
            truncate rounded-xl bg-accent px-4 py-8 text-center text-2xl`}
        >
          {value}
        </p>
      )}
    </div>
  );
}
