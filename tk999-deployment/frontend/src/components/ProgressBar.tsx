interface ProgressBarProps {
  percentage: number;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export default function ProgressBar({ 
  percentage, 
  variant = 'primary', 
  className = '' 
}: ProgressBarProps) {
  const variantClasses = {
    primary: 'progress-fill',
    success: 'progress-fill-success',
    warning: 'progress-fill-warning',
    error: 'progress-fill-error'
  };

  return (
    <div className={`progress-bar ${className}`}>
      <div 
        className={variantClasses[variant]}
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      ></div>
    </div>
  );
}