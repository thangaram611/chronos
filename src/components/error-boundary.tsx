import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export function ErrorBoundary() {
  const error = useRouteError();
  console.error('Uncaught error:', error);

  let errorMessage = 'An unexpected error occurred.';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="mb-2 text-2xl font-bold text-red-600">Something went wrong</h2>
      <p className="mb-4 text-gray-600">{errorMessage}</p>
      <button
        onClick={() => window.location.reload()}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}
