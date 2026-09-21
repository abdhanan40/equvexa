/**
 * Heading ids of the panels a form shows after a submission. Focus moves to
 * the matching heading once a result arrives, so what happened is announced
 * and the keyboard continues from the panel.
 */
export const INQUIRY_PANEL_TITLE_ID = {
  sent: "inquiry-sent-title",
  fallback: "inquiry-fallback-title",
} as const;
