/**
 * A designed line break for display headings that only applies from the
 * `sm` breakpoint up. On phones the heading wraps naturally instead, which
 * avoids stranded single words in large type.
 */
export function LineBreak() {
  return (
    <>
      {" "}
      <br className="hidden sm:inline" />
    </>
  );
}
