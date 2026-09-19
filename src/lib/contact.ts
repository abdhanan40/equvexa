import { siteConfig } from "@/config/site";

/** WhatsApp chat with EQUVEXA, optionally with a pre-filled message. */
export function whatsappUrl(message?: string) {
  const url = `https://wa.me/${siteConfig.contact.whatsapp.number}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}

/** Email link to EQUVEXA, optionally with a subject and body. */
export function mailtoUrl(options?: { subject?: string; body?: string }) {
  const params: string[] = [];
  if (options?.subject) {
    params.push(`subject=${encodeURIComponent(options.subject)}`);
  }
  if (options?.body) {
    params.push(`body=${encodeURIComponent(options.body)}`);
  }
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return `mailto:${siteConfig.contact.email}${query}`;
}

export const whatsappMessages = {
  general: "Hello EQUVEXA, I'd like to discuss a B2B inquiry.",
  wholesale: "Hello EQUVEXA, I'm interested in a wholesale inquiry.",
  privateLabel:
    "Hello EQUVEXA, I'd like to discuss OEM / private-label options.",
  category: (categoryName: string) =>
    `Hello EQUVEXA, I'm interested in a wholesale inquiry for ${categoryName}.`,
} as const;
