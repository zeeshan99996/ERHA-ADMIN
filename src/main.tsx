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
          <p style={{ color: '#f87171', fontSize: 16, fontWeight: 600, maxWidth: 600, margin: '0 0 12px 0', wordBreak: 'break-word' }}>
            {String(this.state.error?.message || this.state.error)}
          </p>
          {this.state.error?.stack && (
            <pre style={{ color: '#94a3b8', fontSize: 11, maxWidth: 700, maxHeight: 200, overflow: 'auto', textAlign: 'left', backgroundColor: '#020617', padding: 12, borderRadius: 8, margin: '0 0 20px 0', whiteSpace: 'pre-wrap' }}>
              {String(this.state.error.stack)}
            </pre>
          )}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then((registrations) => {
                    for (const r of registrations) r.unregister();
                  });
                }
                if ('caches' in window) {
                  caches.keys().then((names) => {
                    for (const name of names) caches.delete(name);
                  });
                }
                window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
              }}
              style={{ padding: '10px 20px', borderRadius: 8, backgroundColor: '#6366f1', color: '#ffffff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              Force Refresh & Update
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then((registrations) => {
                    for (const r of registrations) r.unregister();
                  });
                }
                if ('caches' in window) {
                  caches.keys().then((names) => {
                    for (const name of names) caches.delete(name);
                  });
                }
                window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
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
