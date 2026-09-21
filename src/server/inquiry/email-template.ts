import "server-only";

import { siteConfig } from "@/config/site";
import { getProductCategory } from "@/data/product-categories";
import { inquiryTypeOptions } from "@/lib/inquiry";
import type { ContactInquiry, QuoteInquiry } from "@/types/inquiry";

/*
 * The email EQUVEXA receives for each inquiry, as plain text and simple HTML.
 * Every buyer-supplied value is escaped before it enters the HTML; there are
 * no images, remote assets, links or tracking. Colours repeat values from
 * src/styles/tokens.css because email clients cannot read CSS variables.
 */

export type InquiryEmail = { subject: string; text: string; html: string };

type Context = {
  reference: string;
  receivedAt: Date;
  /** Site page the inquiry was sent from, e.g. /request-a-quote?category=… */
  sourcePath: string;
};

type Row = { label: string; value: string };

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** A subject can never carry line breaks or other control characters. */
function subjectLine(text: string) {
  return text
    .replace(/[\u0000-\u001F\u007F\u2028\u2029]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

function formatReceived(date: Date) {
  const utc = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
  const pakistan = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
  return `${utc} UTC (${pakistan} Pakistan time)`;
}

function render(
  title: string,
  details: Row[],
  messageLabel: string,
  message: string,
  context: Context,
): Omit<InquiryEmail, "subject"> {
  const footer: Row[] = [
    { label: "Source page", value: context.sourcePath },
    { label: "Received", value: formatReceived(context.receivedAt) },
    { label: "Reference", value: context.reference },
  ];

  const labelWidth = 22;
  const textRows = (rows: Row[]) =>
    rows.map((row) => `${`${row.label}:`.padEnd(labelWidth)}${row.value}`).join("\n");
  const text = [
    title,
    "",
    textRows(details),
    "",
    `${messageLabel}:`,
    message,
    "",
    "----------------------------------------",
    textRows(footer),
    "",
    "Reply to this email to answer the buyer directly.",
  ].join("\n");

  const cell = "padding:6px 0;vertical-align:top;font-size:14px;line-height:1.5;";
  const htmlRows = (rows: Row[]) =>
    rows
      .map(
        (row) =>
          `<tr><td style="${cell}color:#6b645a;width:170px;padding-right:16px;">${escapeHtml(row.label)}</td>` +
          `<td style="${cell}color:#0e0d0b;">${escapeHtml(row.value)}</td></tr>`,
      )
      .join("");
  const html = [
    "<!doctype html>",
    '<html lang="en"><head><meta charset="utf-8"></head>',
    '<body style="margin:0;padding:24px;background:#f6f1e7;font-family:Arial,Helvetica,sans-serif;color:#0e0d0b;">',
    '<div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dcd3c2;padding:28px;">',
    `<p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#78623a;">${escapeHtml(siteConfig.brand)} website</p>`,
    `<h1 style="margin:0 0 20px;font-size:20px;font-weight:bold;">${escapeHtml(title)}</h1>`,
    `<table role="presentation" style="border-collapse:collapse;width:100%;">${htmlRows(details)}</table>`,
    `<p style="margin:20px 0 6px;font-size:14px;color:#6b645a;">${escapeHtml(messageLabel)}</p>`,
    `<div style="white-space:pre-wrap;font-size:14px;line-height:1.6;border-left:3px solid #a88b57;padding:4px 0 4px 14px;">${escapeHtml(message)}</div>`,
    '<hr style="border:none;border-top:1px solid #dcd3c2;margin:24px 0 12px;">',
    `<table role="presentation" style="border-collapse:collapse;width:100%;">${htmlRows(footer)}</table>`,
    '<p style="margin:16px 0 0;font-size:13px;color:#6b645a;">Reply to this email to answer the buyer directly.</p>',
    "</div></body></html>",
  ].join("");

  return { text, html };
}

export function quoteEmail(values: QuoteInquiry, context: Context): InquiryEmail {
  const category = getProductCategory(values.category)?.name ?? values.category;
  const inquiryType =
    inquiryTypeOptions.find((option) => option.value === values.inquiryType)?.label ??
    values.inquiryType;

  const details: Row[] = [
    { label: "Inquiry type", value: inquiryType },
    { label: "Product category", value: category },
    ...(values.quantity ? [{ label: "Estimated quantity", value: values.quantity }] : []),
    { label: "Name", value: values.fullName },
    { label: "Company", value: values.company },
    { label: "Business email", value: values.email },
    { label: "Country", value: values.country },
  ];

  return {
    subject: subjectLine(
      `Quote request: ${category} (${inquiryType}) — ${values.company}, ${values.country} [${context.reference}]`,
    ),
    ...render(
      "New quote request",
      details,
      "Message / requirements",
      values.message,
      context,
    ),
  };
}

export function contactEmail(values: ContactInquiry, context: Context): InquiryEmail {
  const details: Row[] = [
    { label: "Name", value: values.name },
    ...(values.company ? [{ label: "Company", value: values.company }] : []),
    { label: "Email", value: values.email },
  ];

  return {
    subject: subjectLine(
      `Website message from ${values.name}${values.company ? ` (${values.company})` : ""} [${context.reference}]`,
    ),
    ...render("New message from the contact form", details, "Message", values.message, context),
  };
}
