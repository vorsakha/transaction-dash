import { Loader } from "lucide-react";

export const LoadingSpinner = ({
  size = "md",
  ...props
}: {
    size?: "sm" | "md" | "lg";
    className?: string;
    'data-testid'?: string;
  }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const { className, ...restProps } = props

  return (
    <div className={`flex items-center justify-center ${className || ''}`} {...restProps}>
      <Loader
        className={`animate-spin ${sizeClasses[size]} text-current`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};
