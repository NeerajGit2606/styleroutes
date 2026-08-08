type BrandMarkProps = {
  size?: number;
  className?: string;
};

/**
 * Coded placeholder for the client's lion-crest "SR" monogram until the
 * real logo artwork is available. Swap the <svg> body below for an
 * <Image src="/brand/logo.svg" .../> once that file is handed over.
 */
export function BrandMark({ size = 40, className }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Style Route crest"
      className={className}
    >
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <text
        x="50"
        y="47"
        textAnchor="middle"
        fontFamily="var(--font-serif, serif)"
        fontSize="30"
        fill="currentColor"
      >
        SR
      </text>
      <path
        d="M30 66c4-7 12-11 20-11s16 4 20 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M50 55c-6 0-11 3-11 3s3 4 11 4 11-4 11-4-5-3-11-3Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}
