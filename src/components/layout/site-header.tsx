"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/layout/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Container } from "@/components/ui/container";
import {
  controlTransition,
  glassControl,
  glassControlHover,
  navCapsuleClasses,
  navPillClasses,
} from "@/components/ui/control";
import { isActivePath, mainNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

/**
 * Fixed site header. On the homepage it floats above the cinematic hero;
 * elsewhere it sits over each page's dark hero on the page grid. Both carry
 * the same glass navigation capsule and become a restrained dark glass bar
 * on scroll.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled(24);
  const home = pathname === routes.home;

  return (
    <header
      className={cn(
        "tone-dark fixed inset-x-0 top-0 z-50 text-foreground transition-[background-color,border-color] duration-700 ease-out-expo",
        !home && "border-b",
        scrolled
          ? cn("bg-ink/88 backdrop-blur-xl", !home && "border-ivory/10")
          : cn("bg-transparent", !home && "border-transparent"),
      )}
    >
      {home ? (
        <div
          className={cn(
            "flex items-center justify-between gap-6 px-5 transition-[padding] duration-700 ease-out-expo motion-safe:animate-drop-in sm:px-8 lg:px-[4%]",
            scrolled ? "py-3" : "py-3 lg:py-8",
          )}
        >
          <HeaderContent pathname={pathname} />
        </div>
      ) : (
        <Container
          className={cn(
            "flex items-center justify-between gap-6 transition-[height] duration-700 ease-out-expo",
            scrolled ? "h-18" : "h-18 lg:h-header",
          )}
        >
          <HeaderContent pathname={pathname} />
        </Container>
      )}
    </header>
  );
}

function HeaderContent({ pathname }: { pathname: string }) {
  return (
    <>
      <Logo />

      <nav aria-label="Main" className="hidden nav:block">
        <ul className={navCapsuleClasses}>
          {mainNavigation.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={navPillClasses(active)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex items-center gap-2">
        <Link
          href={routes.requestQuote}
          className={cn(
            "hidden h-11 items-center rounded-full px-6 text-sm font-semibold text-foreground sm:inline-flex",
            glassControl,
            glassControlHover,
            controlTransition,
            "hover:-translate-y-0.5",
          )}
        >
          Request a Quote
        </Link>
        <MobileMenu />
      </div>
    </>
  );
}
