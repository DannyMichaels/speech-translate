import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.

    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true, error, errorInfo });

    // You can also log the error to an error reporting service
    console.log({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h1>Something went wrong</h1>

          <pre>
            <code>{JSON.stringify(this.state.error, null, 2)}</code>
            <br />
            <code>{JSON.stringify(this.state.errorInfo, null, 2)}</code>
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
