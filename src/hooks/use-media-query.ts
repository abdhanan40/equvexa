import { useCallback, useSyncExternalStore } from "react";

/** Subscribes to a CSS media query. Returns `serverValue` during SSR. */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * True when any connected input is a precise, hovering pointer (mouse,
 * trackpad, pen). Uses `any-` queries so touchscreen laptops with a trackpad
 * still qualify; handlers should ignore events with pointerType "touch".
 */
export function useFinePointer() {
  return useMediaQuery("(any-hover: hover) and (any-pointer: fine)");
}
