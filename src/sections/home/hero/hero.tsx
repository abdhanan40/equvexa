import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/section-label";
import { productCategoryPath, routes } from "@/config/routes";
import { heroShowcase } from "@/data/hero-showcase";
import { categoryBySlug } from "@/data/product-categories";
import { enterDelay } from "@/lib/utils";

import { HeroExperience, type HeroItem } from "./hero-experience";
import styles from "./hero.module.css";

export function Hero() {
  const items: HeroItem[] = heroShowcase.map((entry) => {
    const category = categoryBySlug(entry.slug);
    return {
      slug: category.slug,
      name: category.name,
      href: productCategoryPath(category.slug),
      cutout: entry.cutout,
      transition: entry.transition,
      tone: entry.tone,
      tilt: entry.tilt,
      scale: entry.scale,
      offset: entry.offset,
      card: entry.card,
      objects: entry.objects,
    };
  });

  return (
    <HeroExperience
      items={items}
      intro={
        <>
          <div className="animate-enter">
            <SectionLabel className="lg:whitespace-nowrap">
              Equestrian gear manufacturer &amp; exporter
            </SectionLabel>
          </div>
          {/* The lines are separate blocks; the spaces keep the heading
              readable as one sentence for assistive technology. */}
          <h1 id="hero-title" className={`${styles.headline} mt-5`}>
            <span className="animate-enter" style={enterDelay(100)}>
              Crafted
            </span>{" "}
            <span className="animate-enter" style={enterDelay(200)}>
              for the
            </span>{" "}
            <span
              className="animate-enter text-accent"
              style={enterDelay(300)}
            >
              ride.
            </span>
          </h1>
        </>
      }
      copy={
        <>
          <p
            className={`${styles.description} animate-enter`}
            style={enterDelay(420)}
          >
            Premium equestrian riding gear from Pakistan, made for
            international B2B buyers: tack shops, retailers, distributors and
            private-label brands.
          </p>
          <div className="mt-8 animate-enter" style={enterDelay(520)}>
            <Link href={routes.products} className={styles.pill}>
              Explore products
              <span className={styles.pillIcon}>
                <ArrowRightIcon className="size-4" />
              </span>
            </Link>
          </div>
        </>
      }
      badge={
        <Link
          href={routes.oemPrivateLabel}
          className={`${styles.badgeLink} animate-enter`}
          style={enterDelay(640)}
        >
          <span className={styles.badgeIcon}>
            <ArrowRightIcon className="size-5 -rotate-45" />
          </span>
          <span className={styles.badgeText}>
            <span className={styles.badgeTitle}>B2B inquiries</span>
            <span className={styles.badgeSubtitle}>OEM &amp; private label</span>
          </span>
        </Link>
      }
    />
  );
}
