/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in child component tree
 * Prevents full app crash when a single component fails
 * Sprint 10 - Rodada 22
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('🔴 ErrorBoundary caught error:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-red-200 dark:border-red-800 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-shrink-0">
                <svg
                  className="h-12 w-12 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Ops! Algo deu errado
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Um erro inesperado ocorreu neste componente
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h2 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
                  Mensagem de Erro:
                </h2>
                <pre className="text-xs text-red-700 dark:text-red-300 font-mono whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer">
                <summary className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  🔍 Stack Trace (DEV)
                </summary>
                <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap break-words mt-2 overflow-auto max-h-64">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                🔄 Tentar Novamente
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                🏠 Ir para Home
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              Se o problema persistir, contate o suporte técnico
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
