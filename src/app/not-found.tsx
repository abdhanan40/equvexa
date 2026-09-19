import { ButtonLink } from "@/components/ui/button";
import { LineBreak } from "@/components/ui/line-break";
import { routes } from "@/config/routes";
import { PageHero } from "@/sections/shared/page-hero";

export default function NotFound() {
  return (
    <PageHero
      className="min-h-[80svh]"
      eyebrow="Page not found"
      title={
        <>
          This page has
          <LineBreak />
          ridden on
        </>
      }
      intro="The page you are looking for does not exist or has moved. Explore the EQUVEXA range or get in touch with our team."
      actions={
        <>
          <ButtonLink href={routes.products} size="lg">
            Explore Products
          </ButtonLink>
          <ButtonLink href={routes.home} variant="secondary" size="lg">
            Back to home
          </ButtonLink>
        </>
      }
    />
  );
}
