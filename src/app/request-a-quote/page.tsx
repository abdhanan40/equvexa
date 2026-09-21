import { Suspense } from "react";

import { Container } from "@/components/ui/container";
import { LineBreak } from "@/components/ui/line-break";
import { routes } from "@/config/routes";
import { pageMetadata } from "@/lib/metadata";
import {
  QuoteFormFallback,
  QuoteFormFromSearchParams,
} from "@/sections/quote/quote-form";
import { DirectContact } from "@/sections/shared/direct-contact";
import { PageHero } from "@/sections/shared/page-hero";

export const metadata = pageMetadata({
  title: "Request a Quote",
  description:
    "Request a B2B quote from EQUVEXA for wholesale, OEM or private-label orders of equestrian riding gear.",
  path: routes.requestQuote,
});

const nextSteps = [
  {
    title: "Send your inquiry",
    description:
      "Complete the form. Your details go straight to the EQUVEXA inbox by email.",
  },
  {
    title: "Get a reply by email",
    description:
      "Answers come to the email address you give. WhatsApp stays open if you prefer to chat.",
  },
  {
    title: "Discuss your order",
    description:
      "The EQUVEXA team reviews your requirements and continues the conversation with you.",
  },
] as const;

export default function RequestQuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title={
          <>
            Tell us what
            <LineBreak />
            you need
          </>
        }
        intro="Share your requirements for wholesale, OEM or private-label orders. Quotations are prepared for each inquiry; nothing is purchased or paid for on this website."
      />

      <section aria-label="Quote request form" className="py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <Suspense fallback={<QuoteFormFallback />}>
              <QuoteFormFromSearchParams />
            </Suspense>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="surface-dark p-8 sm:p-10 lg:sticky lg:top-28">
              <h2 className="font-display text-display-md tracking-display uppercase">
                What happens next
              </h2>
              <ol className="mt-8 grid gap-7">
                {nextSteps.map((step, index) => (
                  <li key={step.title} className="grid grid-cols-[2.5rem_1fr]">
                    <span className="font-display text-display-sm text-accent tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold tracking-[0.14em] uppercase">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <h3 className="mt-12 text-eyebrow font-semibold tracking-eyebrow text-accent uppercase">
                Prefer to talk directly?
              </h3>
              <DirectContact className="mt-4" />
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
