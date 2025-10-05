interface ErrorMessageProps {
  message: string | null;
  className?: string;
}

export const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <div className={`text-destructive text-sm mt-1 ${className}`} role="alert">
      {message}
    </div>
  );
};
