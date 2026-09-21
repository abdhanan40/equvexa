import { INQUIRY_META_FIELDS } from "@/lib/inquiry";

/*
 * A field only an automated sender fills in. It is taken out of the page for
 * everyone else: no space, no focus stop, and inert, so neither the pointer
 * nor the keyboard nor a screen reader can reach it. A submission that
 * carries a value here is dropped on the server.
 */
export function SpamTrap() {
  return (
    <div
      aria-hidden="true"
      inert
      className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
    >
      <label htmlFor={INQUIRY_META_FIELDS.trap}>
        Reference code (leave this field empty)
      </label>
      <input
        id={INQUIRY_META_FIELDS.trap}
        name={INQUIRY_META_FIELDS.trap}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
