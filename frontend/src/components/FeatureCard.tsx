import { lusitana } from "@/lib/fonts";
import clsx from "clsx";

export const menuItems: any = {
  "Dream Journaling": "📓",
  Leaderboard: "🏆",
  Profile: "👤",
  Stats: "📊",
  "More Dream Analysis": "💤",
  Products: "🛍️",
  Newsletter: "📰",
  "Deep Sleep Sounds": "😴",
};

export default function FeatureCard({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  const Icon = menuItems[title];
  return (
    <div className="rounded-xl bg-secondary p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? (
          <span className="h-full w-full rounded-full text-4xl">{Icon}</span>
        ) : null}
        <h3 className="ml-2 text-md font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
            truncate rounded-xl bg-accent px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
