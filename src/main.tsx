import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error in ERHA Admin:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', fontFamily: 'system-ui, sans-serif', textAlign: 'center', backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 28, color: '#f87171' }}>⚠️</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px 0' }}>ERHA Admin Error</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, maxWidth: 500, margin: '0 0 24px 0', wordBreak: 'break-word' }}>
            {String(this.state.error?.message || this.state.error)}
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '10px 20px', borderRadius: 8, backgroundColor: '#6366f1', color: '#ffffff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              Refresh Page
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              style={{ padding: '10px 20px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              Clear Storage & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
