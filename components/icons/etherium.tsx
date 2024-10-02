import * as React from "react";

const Etherium = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={512}
    height={512}
    viewBox="0 0 200 200"
    {...props}
  >
    <g data-name="Layer 2">
      <g data-name="Flat Color">
        <g data-name="Ethereum (ETH)">
          <circle
            cx={100}
            cy={100}
            r={100}
            fill="#5f7edd"
            data-original="#5f7edd"
          />
          <path
            fill="#fff"
            d="m99.99 127.24-33.6-19.85 33.6 47.36 33.63-47.36z"
            data-original="#ffffff"
          />
          <path
            fill="#fff"
            d="m133.6 101.02-33.61 19.86-33.61-19.86 33.61-55.77z"
            data-original="#ffffff"
          />
          <path
            fill="#c1ccf7"
            d="M133.6 101.02 99.99 85.74V45.25zm.02 6.37-33.63 47.36v-27.51zM99.99 85.74v35.14l-33.6-19.86z"
            data-original="#c1ccf7"
          />
          <path
            fill="#8198ee"
            d="m133.6 101.02-33.61 19.86V85.74z"
            data-original="#8198ee"
          />
        </g>
      </g>
    </g>
  </svg>
);
export default Etherium;
