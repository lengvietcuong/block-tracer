import * as React from "react";

const Solana = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    xmlSpace="preserve"
    width={512}
    height={512}
    viewBox="0 0 200 200"
    {...props}
  >
    <linearGradient
      id="b"
      x1={100}
      x2={100}
      y1={200}
      gradientUnits="userSpaceOnUse"
    >
      <stop offset={0} stopColor="#170e2b" />
      <stop offset={1} stopColor="#210066" />
    </linearGradient>
    <linearGradient
      id="a"
      x1={137.3}
      x2={86.75}
      y1={-39.5}
      y2={-136.3}
      gradientTransform="matrix(1 0 0 -1 0 16)"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset={0} stopColor="#00ffa3" />
      <stop offset={1} stopColor="#dc1fff" />
    </linearGradient>
    <linearGradient
      xlinkHref="#a"
      id="c"
      x1={115.24}
      x2={64.74}
      y1={-27.97}
      y2={-124.78}
    />
    <linearGradient
      xlinkHref="#a"
      id="d"
      x1={126.24}
      x2={75.68}
      y1={-33.72}
      y2={-130.52}
    />
    <g data-name="Layer 2">
      <g data-name="Solana (SOL)">
        <circle
          cx={100}
          cy={100}
          r={100}
          fill="url(#b)"
          data-original="url(#b)"
        />
        <path
          fill="url(#a)"
          d="M69.2 118.86a2.87 2.87 0 0 1 2.1-.88h73a1.54 1.54 0 0 1 1.46 1.63 1.6 1.6 0 0 1-.41 1L130.93 135a3 3 0 0 1-2.1.88h-73a1.49 1.49 0 0 1-1.05-2.65z"
          data-original="url(#a)"
        />
        <path
          fill="url(#c)"
          d="M69.2 65a3 3 0 0 1 2.1-.89h73a1.5 1.5 0 0 1 1.05 2.55l-14.42 14.48a3 3 0 0 1-2.1.88h-73a1.55 1.55 0 0 1-1.46-1.63 1.6 1.6 0 0 1 .41-1z"
          data-original="url(#c)"
        />
        <path
          fill="url(#d)"
          d="M130.93 91.76a2.92 2.92 0 0 0-2.1-.89h-73a1.55 1.55 0 0 0-1.46 1.63 1.58 1.58 0 0 0 .41 1l14.42 14.35a2.92 2.92 0 0 0 2.1.89h73a1.5 1.5 0 0 0 1.05-2.55z"
          data-original="url(#d)"
        />
      </g>
    </g>
  </svg>
);
export default Solana;
