import { ProductPhoto } from "@/components/product/product-photo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { LineBreak } from "@/components/ui/line-break";
import { quotePath, routes } from "@/config/routes";
import { categoryBySlug } from "@/data/product-categories";

const inquiryTypes = [
  {
    title: "Wholesale orders",
    description:
      "Stock for tack shops, saddlery stores and equestrian retailers.",
  },
  {
    title: "Distributor inquiries",
    description: "Discuss supply for regional and national distribution.",
  },
  {
    title: "Importers",
    description:
      "Share destination and order requirements for international supply.",
  },
  {
    title: "Private-label brands",
    description: "Discuss EQUVEXA products presented under your own brand.",
  },
] as const;

export function WholesaleSection() {
  const image = categoryBySlug("horse-bits").images[3];

  return (
    <section
      aria-labelledby="wholesale-title"
      className="surface-dark grain relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 opacity-40 lg:block"
      >
        <ProductPhoto image={image} alt="" sizes="50vw" className="h-full" />
        <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/70 to-ink/20" />
      </div>

      <Container className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-6">
          <SectionLabel>Wholesale / Export</SectionLabel>
          <h2
            id="wholesale-title"
            className="mt-6 font-display text-display-xl tracking-display uppercase"
          >
            Built for
            <LineBreak />
            global
            <LineBreak />
            partnerships.
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-muted">
            EQUVEXA welcomes B2B inquiries from equestrian businesses around
            the world. Share your requirements and speak directly with our
            team by email or WhatsApp.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href={quotePath({ inquiry: "wholesale" })} size="lg">
              Wholesale inquiry
            </ButtonLink>
            <ButtonLink href={routes.wholesaleExport} variant="text">
              How it works
            </ButtonLink>
          </div>
        </Reveal>

        <ul className="self-end border-t border-border lg:col-span-5 lg:col-start-8">
          {inquiryTypes.map((type, index) => (
            <Reveal
              as="li"
              key={type.title}
              delay={index * 90}
              className="group grid grid-cols-[2.5rem_1fr] border-b border-border py-6"
            >
              <span className="text-eyebrow tracking-eyebrow text-accent tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-sm font-semibold tracking-[0.14em] uppercase transition-colors duration-500 group-hover:text-accent">
                  {type.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {type.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
