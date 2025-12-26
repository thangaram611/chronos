import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <h2 className="mb-2 text-2xl font-bold text-red-600">Something went wrong</h2>
            <p className="mb-4 text-gray-600">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
