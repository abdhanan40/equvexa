import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { LineBreak } from "@/components/ui/line-break";
import { quotePath, routes } from "@/config/routes";
import { whatsappMessages, whatsappUrl } from "@/lib/contact";
import { pageMetadata } from "@/lib/metadata";
import { CatalogIndex, CatalogList } from "@/sections/products/catalog-list";
import { CtaBand } from "@/sections/shared/cta-band";
import { PageHero } from "@/sections/shared/page-hero";

export const metadata = pageMetadata({
  title: "Products",
  description:
    "Explore seven EQUVEXA equestrian gear categories: riding gloves, stirrups, riding chaps, horse salt, horse riding caps, riding saddles and horse bits, for wholesale and private-label inquiries.",
  path: routes.products,
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title={
          <>
            Equestrian gear
            <LineBreak />
            for B2B buyers
          </>
        }
        intro="Explore the seven EQUVEXA product categories. Each is open to wholesale, distribution and private-label inquiries, with no retail pricing or checkout. Every order starts with a conversation."
        actions={
          <>
            <ButtonLink href={quotePath()} size="lg">
              Request a Quote
            </ButtonLink>
            <ButtonLink
              href={whatsappUrl(whatsappMessages.wholesale)}
              variant="secondary"
              size="lg"
              icon={<WhatsAppIcon className="size-5 shrink-0" />}
            >
              WhatsApp
            </ButtonLink>
          </>
        }
      />
      <CatalogIndex />
      <CatalogList />
      <CtaBand
        eyebrow="B2B inquiries"
        title={
          <>
            Found the right
            <LineBreak />
            categories?
          </>
        }
        intro="Tell us which products you are interested in, with quantities and any branding needs, to start the conversation with our team."
      />
    </>
  );
}
