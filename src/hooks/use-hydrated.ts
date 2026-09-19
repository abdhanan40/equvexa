import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during server rendering and hydration, true once the component is
 * interactive. Used to keep form submit buttons disabled until JavaScript
 * handles them, so a native submit never puts form data into the URL.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
