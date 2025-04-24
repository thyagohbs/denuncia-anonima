import React from 'react';

interface LogoAlagoasProps {
  width?: string;
  height?: string;
}

export default function LogoAlagoas({ width = "200px", height = "80px" }: LogoAlagoasProps) {
  return (
    <svg
      viewBox="0 0 300 120"
      width={width}
      height={height}
    >
      <path
        d="M150 30c0-16.569 13.431-30 30-30h90c16.569 0 30 13.431 30 30v60c0 16.569-13.431 30-30 30h-90c-16.569 0-30-13.431-30-30V30z"
        fill="#02579B"
      />
      <text
        x="150"
        y="75"
        textAnchor="middle"
        fill="white"
        fontSize="24"
        fontWeight="bold"
      >
        ALAGOAS
      </text>
    </svg>
  );
}