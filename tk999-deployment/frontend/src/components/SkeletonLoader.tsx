interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  count?: number;
}

export default function SkeletonLoader({ 
  width = '100%', 
  height = '1rem', 
  borderRadius = '0.5rem', 
  className = '',
  count = 1
}: SkeletonLoaderProps) {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    ></div>
  ));

  return <>{skeletons}</>;
}