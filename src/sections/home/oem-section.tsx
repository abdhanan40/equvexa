import { ProductPhoto } from "@/components/product/product-photo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { quotePath, routes } from "@/config/routes";
import { categoryBySlug } from "@/data/product-categories";

const services = ["OEM", "Private Label", "Custom Orders"] as const;

export function OemSection() {
  const gloves = categoryBySlug("riding-gloves");
  const stirrups = categoryBySlug("stirrups");
  const caps = categoryBySlug("horse-riding-caps");

  return (
    <section
      aria-labelledby="oem-title"
      className="relative overflow-hidden bg-surface py-24 sm:py-32"
    >
      <Container className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5 lg:py-8">
          <Reveal>
            <SectionLabel>OEM &amp; private label</SectionLabel>
            <h2 id="oem-title" className="sr-only">
              OEM, private label and custom orders
            </h2>
            <ul aria-hidden="true" className="mt-8">
              {services.map((service, index) => (
                <li
                  key={service}
                  className="flex items-baseline gap-5 border-b border-border py-3 first:border-t"
                >
                  <span className="text-eyebrow tracking-eyebrow text-accent tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-display-lg tracking-display uppercase">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-10 max-w-md text-base leading-relaxed text-muted">
              Discuss product specifications, branding requirements and order
              requirements with our team. Share your brief, and we will talk
              through the options for your market.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={routes.oemPrivateLabel}>
                Explore OEM options
              </ButtonLink>
              <ButtonLink href={quotePath({ inquiry: "oem" })} variant="secondary">
                Request a quote
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-7">
          <Reveal as="figure" className="col-span-2 sm:col-span-1 sm:row-span-2">
            <ProductPhoto
              image={gloves.images[2]}
              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
              className="aspect-[4/5] sm:h-full sm:aspect-auto"
            />
            <figcaption className="mt-3 text-eyebrow tracking-eyebrow text-muted uppercase">
              Logo detail · Riding gloves
            </figcaption>
          </Reveal>
          <Reveal as="figure" delay={120}>
            <ProductPhoto
              image={stirrups.images[2]}
              sizes="(min-width: 1024px) 28vw, 45vw"
              className="aspect-square"
            />
            <figcaption className="mt-3 text-eyebrow tracking-eyebrow text-muted uppercase">
              Hardware · Stirrups
            </figcaption>
          </Reveal>
          <Reveal as="figure" delay={220}>
            <ProductPhoto
              image={caps.images[2]}
              sizes="(min-width: 1024px) 28vw, 45vw"
              className="aspect-square"
            />
            <figcaption className="mt-3 text-eyebrow tracking-eyebrow text-muted uppercase">
              Presentation · Riding caps
            </figcaption>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
