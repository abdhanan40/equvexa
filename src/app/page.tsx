import type { Metadata } from "next";

import { LineBreak } from "@/components/ui/line-break";
import { BrandStory } from "@/sections/home/brand-story";
import { Hero } from "@/sections/home/hero/hero";
import { OemSection } from "@/sections/home/oem-section";
import { ProductDiscovery } from "@/sections/home/product-discovery";
import { WholesaleSection } from "@/sections/home/wholesale-section";
import { CtaBand } from "@/sections/shared/cta-band";
import { ProcessSteps } from "@/sections/shared/process-steps";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const inquirySteps = [
  {
    title: "Select product",
    description:
      "Browse the seven EQUVEXA categories and shortlist the gear that suits your market.",
  },
  {
    title: "Share requirements",
    description:
      "Tell us about quantities, styles, sizing and any branding or packaging needs.",
  },
  {
    title: "Request quote",
    description:
      "Send your inquiry through the quote form, by email or on WhatsApp.",
  },
  {
    title: "Discuss order",
    description:
      "Our team reviews your requirements and follows up to discuss the details with you.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductDiscovery />
      <BrandStory />
      <OemSection />
      <WholesaleSection />
      <ProcessSteps
        eyebrow="How it works"
        title={
          <>
            From first inquiry
            <LineBreak />
            to confirmed order
          </>
        }
        intro="Every order starts with a conversation. Nothing is purchased or paid for on this website."
        steps={inquirySteps}
      />
      <CtaBand />
    </>
  );
}
