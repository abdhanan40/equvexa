"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import { iconButtonClasses } from "@/components/ui/control";
import {
  CloseIcon,
  MailIcon,
  MenuIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import { isActivePath, mainNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { mailtoUrl, whatsappMessages, whatsappUrl } from "@/lib/contact";
import { cn, enterDelay } from "@/lib/utils";

/**
 * Full-screen navigation for small screens, built on a native modal
 * <dialog>: focus moves into the menu, Escape closes it, the page behind is
 * inert and focus returns to the menu button on close. Page scrolling is
 * locked by a rule in globals.css.
 */
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close after any navigation, including browser back and forward.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const openMenu = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  // State is updated here as well as in onClose, so the button's
  // aria-expanded stays correct even where the close event is delayed.
  const closeMenu = () => {
    dialogRef.current?.close();
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={openMenu}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className={iconButtonClasses("nav:hidden")}
      >
        <MenuIcon className="size-5" />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label="Menu"
        onClose={() => setOpen(false)}
        onKeyDown={(event) => {
          // Native dialogs close on Escape; this also covers browsers that
          // skip the cancel event after repeated presses.
          if (event.key === "Escape") closeMenu();
        }}
        className="surface-dark glow-warm fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto p-0 opacity-0 transition-[opacity,display,overlay] transition-discrete duration-500 ease-out-expo backdrop:bg-transparent open:opacity-100 starting:open:opacity-0 nav:hidden"
      >
        <div className="flex min-h-full flex-col px-5 pb-8 sm:px-8">
          <div className="flex h-18 items-center justify-between">
            <Logo onClick={closeMenu} />
            <button
              type="button"
              onClick={closeMenu}
              autoFocus
              className={iconButtonClasses()}
            >
              <CloseIcon className="size-5" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Main" className="mt-10">
            <ol className="border-t border-border">
              {mainNavigation.map((item, index) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li
                    key={item.href}
                    className={cn(
                      "border-b border-border",
                      open && "motion-safe:animate-enter",
                    )}
                    style={enterDelay(80 + index * 50)}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className="group flex min-h-16 items-center gap-5 py-3"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "w-6 text-eyebrow tracking-eyebrow tabular-nums",
                          active ? "text-accent" : "text-muted",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-display text-[2rem] leading-none uppercase transition-colors duration-500",
                          active
                            ? "text-accent"
                            : "text-foreground group-hover:text-accent",
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="mt-auto pt-12">
            <ButtonLink
              href={routes.requestQuote}
              onClick={closeMenu}
              size="lg"
              className="w-full"
            >
              Request a Quote
            </ButtonLink>
            <ul className="mt-8 grid gap-4 text-sm text-muted">
              <li>
                <a
                  href={whatsappUrl(whatsappMessages.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-3 transition-colors hover:text-foreground"
                >
                  <WhatsAppIcon className="size-5 text-accent" />
                  WhatsApp {siteConfig.contact.whatsapp.display}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={mailtoUrl()}
                  className="inline-flex min-h-11 items-center gap-3 break-all transition-colors hover:text-foreground"
                >
                  <MailIcon className="size-5 shrink-0 text-accent" />
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </dialog>
    </>
  );
}
