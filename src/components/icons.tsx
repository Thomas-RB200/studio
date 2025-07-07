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
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
      {/* Racket head */}
      <path d="M15.32 3.31a7.5 7.5 0 0 0-12 5.23c0 3.43 2.3 6.34 5.48 7.28" />
      {/* Handle */}
      <path d="m9.5 16 1.45 4.35a1 1 0 0 0 1.9 0L14.3 16" />
      {/* Ball */}
      <path d="M21.5 11.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
      <path d="m18.5 12.5 1-1.5" />
      {/* Motion lines */}
      <path d="M16 10.5h-3" />
      <path d="M16.5 12.5H13" />
      {/* Dots and squares */}
      <circle cx="9.5" cy="8" r=".5" fill="currentColor" />
      <circle cx="11.5" cy="9" r=".5" fill="currentColor" />
      <circle cx="12.5" cy="7" r=".5" fill="currentColor" />
      <circle cx="12.5" cy="11" r=".5" fill="currentColor" />
      <circle cx="10.5" cy="11.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="10" r=".5" fill="currentColor" />
      <circle cx="10.5" cy="9.5" r=".5" fill="currentColor" />
      <path d="M14.5 15h.01" strokeWidth="2.5" />
      <path d="M16 15h.01" strokeWidth="2.5" />
    </svg>
  );
}
