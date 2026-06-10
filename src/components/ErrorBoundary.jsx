import { Component } from 'react'

// Catches render-time errors anywhere below it and shows a recoverable message
// instead of a blank white screen.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Surface in the console for debugging; no external logging.
    console.error('Unhandled UI error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
          The page hit an unexpected error. Reloading usually fixes it. If it keeps happening, return to the home screen.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={() => window.location.reload()}
            style={{ background: '#162447', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '11px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            Reload
          </button>
          <button
            onClick={() => { window.location.hash = '#/'; window.location.reload() }}
            style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '11px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            Go home
          </button>
        </div>
      </div>
    )
  }
}
