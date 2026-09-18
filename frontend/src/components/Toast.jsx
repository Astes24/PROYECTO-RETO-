import React, { useCallback, useMemo, useState } from 'react';
import { IconCheck, IconAlert, IconInfo, IconClose } from './icons';
import { ToastContext } from './toast-context';

const ICONS = { success: IconCheck, error: IconAlert, info: IconInfo };

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
      setTimeout(() => removeToast(id), 4500);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" role="region" aria-label="Notificaciones">
        <div aria-live="polite" aria-atomic="false">
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type] || IconInfo;
            return (
              <div key={toast.id} className={`toast toast-${toast.type}`} style={{ marginBottom: 'var(--sp-2)' }}>
                <Icon />
                <span className="toast-body">{toast.message}</span>
                <button
                  type="button"
                  className="btn-icon toast-close"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Cerrar notificación"
                  style={{ width: 28, height: 28 }}
                >
                  <IconClose />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ToastContext.Provider>
  );
};
