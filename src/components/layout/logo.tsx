import Image from "next/image";
import Link from "next/link";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Header lockup built from the official logo artwork: the emblem beside the
 * wordmark. Both images are transparent crops of public/images/logo/EI-logo.jpeg
 * and are intended for dark backgrounds.
 */
export function Logo({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={routes.home}
      onClick={onClick}
      className={cn("group inline-flex shrink-0 items-center gap-3", className)}
    >
      <Image
        src="/images/logo/equvexa-emblem.png"
        alt=""
        width={550}
        height={547}
        sizes="44px"
        loading="eager"
        className="h-9 w-auto transition-transform duration-700 ease-out-expo group-hover:-rotate-6 lg:h-11"
      />
      <Image
        src="/images/logo/equvexa-wordmark.png"
        alt={siteConfig.brand}
        width={1124}
        height={182}
        sizes="112px"
        loading="eager"
        className="h-3.5 w-auto lg:h-4"
      />
      <span className="sr-only">, home</span>
    </Link>
  );
}
