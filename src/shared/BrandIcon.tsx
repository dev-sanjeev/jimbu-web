interface BrandIconProps {
  size?: number;
  radius?: number;
  className?: string;
}

export function BrandIcon({ size = 40, radius = 8, className }: BrandIconProps) {
  return (
    <img
      src="/icon.png"
      width={size}
      height={size}
      style={{ borderRadius: radius, display: 'block' }}
      alt="Jimbu"
      className={className}
    />
  );
}
