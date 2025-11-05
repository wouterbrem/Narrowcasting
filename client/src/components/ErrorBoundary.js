import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import './ErrorBoundary.css';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      const { error, errorInfo, errorCount } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-icon">
              <AlertCircle size={64} color="#FF3B30" />
            </div>

            <h1 className="error-boundary-title">
              Oops! Something went wrong
            </h1>

            <p className="error-boundary-message">
              We encountered an unexpected error. Don't worry, your data is safe.
              {errorCount > 1 && ` (Error occurred ${errorCount} times)`}
            </p>

            {isDevelopment && error && (
              <div className="error-boundary-details">
                <h3>Error Details (Development Only)</h3>
                <div className="error-boundary-code">
                  <strong>{error.toString()}</strong>
                  {errorInfo && errorInfo.componentStack && (
                    <pre>{errorInfo.componentStack}</pre>
                  )}
                </div>
              </div>
            )}

            <div className="error-boundary-actions">
              <button
                className="btn btn-primary"
                onClick={this.handleReset}
              >
                <RefreshCw size={18} />
                Try Again
              </button>

              <button
                className="btn btn-secondary"
                onClick={this.handleGoHome}
              >
                <Home size={18} />
                Go to Dashboard
              </button>

              <button
                className="btn btn-secondary"
                onClick={this.handleReload}
              >
                <RefreshCw size={18} />
                Reload Page
              </button>
            </div>

            <div className="error-boundary-help">
              <p>
                <strong>What can you do?</strong>
              </p>
              <ul>
                <li>Click "Try Again" to retry the operation</li>
                <li>Go back to the Dashboard and try a different action</li>
                <li>Reload the entire page if the problem persists</li>
                <li>Check the browser console for more details</li>
              </ul>
            </div>

            {!isDevelopment && (
              <p className="error-boundary-contact">
                If this problem continues, please check the application logs or contact support.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
