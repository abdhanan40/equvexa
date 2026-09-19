import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12h15.5M14 6.5l5.5 5.5-5.5 5.5" />
    </Icon>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 12H4.5M10 6.5 4.5 12l5.5 5.5" />
    </Icon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </Icon>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.25a8.75 8.75 0 0 0-7.6 13.08L3.25 20.75l4.52-1.12A8.75 8.75 0 1 0 12 3.25Z" />
      <path
        d="M9.1 8.2c.23-.5.47-.52.7-.53h.58c.2 0 .44.08.55.36l.74 1.78c.08.2.05.43-.08.6l-.48.6a.45.45 0 0 0-.05.5 6.9 6.9 0 0 0 2.96 2.72c.19.1.41.06.54-.1l.6-.7a.5.5 0 0 1 .6-.14l1.73.8c.26.13.36.3.36.5v.55c0 .3-.1.6-.52.9-.45.32-1.22.56-2.04.35-1.17-.3-2.4-.98-3.54-2.1C10.4 12.05 9.63 10.8 9.3 9.7c-.2-.72-.1-1.1-.2-1.5Z"
        fill="currentColor"
        stroke="none"
      />
    </Icon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 8.5h17M3.5 15.5h17" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4.5 12.5 4.5 4.5 10.5-10.5" />
    </Icon>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="8.5" y="8.5" width="12" height="12" rx="1.5" />
      <path d="M15.5 8.5V5A1.5 1.5 0 0 0 14 3.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5" />
    </Icon>
  );
}
