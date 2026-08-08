import Image from "next/image";

type BrandMarkProps = {
  size?: number;
  className?: string;
};

export function BrandMark({ size = 40, className }: BrandMarkProps) {
  return (
    <span
      className={`inline-block shrink-0 overflow-hidden rounded-full ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/logo-square.png"
        alt="Style Route crest"
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
