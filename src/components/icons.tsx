import type { SVGProps } from "react";

export function PadelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
      <circle cx="12" cy="11" r="7" />
      <path d="m12 18 2 4" />
      <path d="M10.5 22h3" />
      <circle cx="12" cy="11" r="0.5" fill="currentColor" />
      <circle cx="10" cy="9.5" r="0.5" fill="currentColor" />
      <circle cx="14" cy="9.5" r="0.5" fill="currentColor" />
      <circle cx="10" cy="12.5" r="0.5" fill="currentColor" />
      <circle cx="14" cy="12.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
