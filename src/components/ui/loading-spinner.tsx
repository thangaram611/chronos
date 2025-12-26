export function LoadingSpinner() {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent text-blue-600 dark:text-blue-400" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
