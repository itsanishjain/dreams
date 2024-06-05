"use client";

import { PropsWithChildren } from "react";

import { useRouter } from "next/navigation";
// import { Price } from "../../drizzle/schema";

interface PricingCardProps {
  title: string;
  description: string;
  benefits: string[];
  isOutlined?: boolean;
  intervale?: string;
  priceId?: string;
}

const priceData: any = {
  id: "",
  active: true,
  prodcuctId: "prod_PLmOlRQ1tafJrK",
  unitAmount: 1900,
  currency: "usd",
  interval: "month",
  description: "Starter",
  metadata: {},
  type: "recurring",
  intervalCount: null,
  trialPeriodDays: null,
};

export default function PricingCard({
  title,
  description,
  benefits,
  isOutlined,
  intervale = "month",
  priceId,
  children,
}: PropsWithChildren<PricingCardProps>) {
  const router = useRouter();
  const isAnyBenefitPresent = benefits?.length;

  return (
    <div
      className={`flex flex-col p-12 ${
        isOutlined ? "shadow-lg" : "shadow-md"
      } rounded-md text-center ${isOutlined ? "scale-110" : "scale-100"} ${
        isOutlined ? "-order-1" : "order-0"
      } sm:scale-100 sm:shadow-md`}
    >
      <h3 className="text-4xl capitalize">{title}</h3>
      <p className="text-2xl">{description}</p>
      <div className="mx-auto mt-8">
        <div className="flex items-end justify-center text-4xl font-bold">
          {children}
          <span className="ml-2 text-2xl font-normal">/{intervale}</span>
        </div>
        {isAnyBenefitPresent && (
          <ul className="text-md mt-2 space-y-2">
            {benefits.map((singleBenefit, idx) => (
              <li key={idx}>{singleBenefit}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="btn mt-4">Get started</div>
    </div>
  );
}
