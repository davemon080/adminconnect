import { Component, ErrorInfo, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message || 'Something went wrong while loading Connect Admin.',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Connect Admin runtime error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#f8fafc', color: '#0f172a', fontFamily: 'Segoe UI, sans-serif' }}>
          <div style={{ maxWidth: 720, width: '100%', background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)' }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>
              Connect Admin
            </p>
            <h1 style={{ margin: '16px 0 12px', fontSize: 32, lineHeight: 1.15 }}>
              The admin panel failed to load
            </h1>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: '#475569' }}>
              {this.state.message}
            </p>
            <div style={{ marginTop: 20, padding: 16, borderRadius: 16, background: '#fff7ed', color: '#9a3412', fontSize: 14, lineHeight: 1.6 }}>
              Common fixes: make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in your deployment environment, and confirm the admin app is serving its built assets from the correct path.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
