import React from 'react';
import { IconAlert } from './icons';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Error de interfaz:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="empty" style={{ paddingTop: 'var(--sp-7)' }}>
          <span className="empty-icon"><IconAlert /></span>
          <h1>Algo se rompió en esta pantalla</h1>
          <p>Recarga la página para volver a empezar. El resto del sistema sigue funcionando.</p>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: 'var(--sp-3)' }}
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
