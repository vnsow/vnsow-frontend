import React from 'react';

/**
 * Detects Google Translate / React reconciliation crashes.
 * GT mutates the DOM by wrapping text nodes in <font> tags. When React
 * later tries to remove/insert children, it fails with NotFoundError
 * because the cached parent-child relationship no longer matches the
 * live DOM. We detect that signature here and show a tailored message.
 */
const isGoogleTranslateCrash = (error) => {
  if (!error) return false;
  const message = (error.message || '').toLowerCase();
  return (
    message.includes('removechild') ||
    message.includes('insertbefore') ||
    message.includes('the node to be removed is not a child') ||
    message.includes('the node before which the new node') ||
    error.name === 'NotFoundError'
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isTranslateCrash: false };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      isTranslateCrash: isGoogleTranslateCrash(error),
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  componentDidMount() {
    // Global net for errors that escape React's render cycle
    // (e.g. removeChild thrown from Radix Portal unmount during GT mutation).
    this.globalErrorHandler = (event) => {
      if (isGoogleTranslateCrash(event.error || event)) {
        this.setState({ hasError: true, isTranslateCrash: true });
        event.preventDefault?.();
      }
    };
    this.unhandledRejectionHandler = (event) => {
      if (isGoogleTranslateCrash(event.reason)) {
        this.setState({ hasError: true, isTranslateCrash: true });
        event.preventDefault?.();
      }
    };
    window.addEventListener('error', this.globalErrorHandler);
    window.addEventListener('unhandledrejection', this.unhandledRejectionHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.globalErrorHandler);
    window.removeEventListener('unhandledrejection', this.unhandledRejectionHandler);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Tailored message for Google Translate crashes
    if (this.state.isTranslateCrash) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" translate="no">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-lg text-center notranslate">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Traducción automática detectada
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Tu navegador está traduciendo esta página automáticamente, lo que está
              causando que la aplicación se cierre.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left text-xs text-amber-900 mb-6 space-y-1">
              <p className="font-semibold">Cómo desactivar la traducción:</p>
              <p>
                1. Toca los tres puntos <span className="inline-block">⋮</span> de Chrome
              </p>
              <p>2. Selecciona "Traducir…"</p>
              <p>3. Toca los tres puntos del banner y elige</p>
              <p className="pl-3">"Nunca traducir este sitio"</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={this.handleReload}
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Recargar página
              </button>
              <button
                onClick={this.handleGoHome}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Ir al inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Generic error fallback
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Ocurrió un error inesperado
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Por favor recarga la página para continuar. Si el problema persiste,
            contacta al administrador.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={this.handleReload}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Recargar página
            </button>
            <button
              onClick={this.handleGoHome}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Ir al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
