import PricingCard from "./PricingCard";

export async function Pricing() {
  return (
    <div className="mt-16 w-full" id="pricing">
      <div className="mx-auto mt-8 grid max-w-6xl gap-4 p-2 md:grid-cols-3">
        <PricingCard
          title="Free"
          description="Give us a try for free"
          benefits={["Up to 100 customers", "No SMS included"]}
        >
          $0
        </PricingCard>
        <PricingCard
          title="Starter"
          description="Best for individual businesses"
          benefits={[
            "Unlimited customers",
            "1000 SMS included",
            "Reservations",
            "Calendar Customizable Notifications",
            "Add Yourself Web Widget",
          ]}
        >
          $19
        </PricingCard>
        <PricingCard
          title="Pro"
          description="Get your team together"
          benefits={[
            "Unlimited customers and locations",
            "3000 SMS included",
            "Reservations",
            "Calendar Customizable Notifications",
            "Add Yourself Web Widget",
          ]}
          priceId="price_1OX4pISCm9zQYDQlTOrtyhJD"
        >
          $49
        </PricingCard>
      </div>
    </div>
  );
}
