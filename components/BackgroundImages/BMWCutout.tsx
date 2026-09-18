"use client";

export default function BMWCutout() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-50 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask
          id="bmw-cutout"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1600"
          height="900"
        >
          <rect
            x="0"
            y="0"
            width="1600"
            height="900"
            fill="white"
          />

          <text
            x="800"
            y="450"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black"
            fontFamily="'BMW Type Next', 'Helvetica Neue', Arial, sans-serif"
            fontSize="190"
            fontWeight="700"
            letterSpacing="-6"
          >
            BMW M4
          </text>
        </mask>
      </defs>

      <rect
        x="0"
        y="0"
        width="1600"
        height="900"
        fill="black"
        mask="url(#bmw-cutout)"
      />
    </svg>
  );
}